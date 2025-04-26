import { FilterQuery, Model, QueryOptions, UpdateQuery, Types } from 'mongoose';
import { BaseSchema } from '../schema/base.schema';

export abstract class BaseRepository<TModel extends BaseSchema> {
  constructor(protected readonly model: Model<TModel>) {}

  create(
    modelData: Omit<TModel, '_id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TModel> {
    return this.model.create({
      ...modelData,
      _id: new Types.ObjectId(),
    });
  }

  async find(
    filterQuery: FilterQuery<TModel>,
    options: QueryOptions = {},
  ): Promise<TModel[]> {
    return (await this.model
      .find(filterQuery, options)
      .lean()
      .exec()) as TModel[];
  }

  async findOne(
    filterQuery: FilterQuery<TModel>,
    options: QueryOptions = {},
  ): Promise<TModel | null> {
    return (await this.model
      .findOne(filterQuery, options)
      .lean()
      .exec()) as TModel;
  }

  async findById(id: string): Promise<TModel | null> {
    return (await this.model.findById(id).lean().exec()) as TModel;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TModel>,
    updateQuery: UpdateQuery<TModel>,
  ): Promise<TModel | null> {
    return (await this.model
      .findOneAndUpdate(
        filterQuery,
        { ...updateQuery, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec()) as TModel;
  }

  async updateById(updateQuery: UpdateQuery<TModel>): Promise<TModel | null> {
    return (await this.model
      .findOneAndUpdate(
        { _id: updateQuery._id },
        { ...updateQuery, updatedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec()) as TModel;
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TModel>,
  ): Promise<TModel | null> {
    return (await this.model
      .findOneAndDelete(filterQuery)
      .lean()
      .exec()) as TModel;
  }

  async deleteById(id: string): Promise<TModel | null> {
    return (await this.model
      .findOneAndDelete({ _id: id })
      .lean()
      .exec()) as TModel;
  }
}
