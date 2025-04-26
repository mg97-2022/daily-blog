import {
  FilterQuery,
  Model,
  QueryOptions,
  UpdateQuery,
  HydratedDocument,
} from 'mongoose';

export abstract class BaseRepository<TModel> {
  constructor(protected readonly model: Model<TModel>) {}

  create(modelData: TModel): Promise<HydratedDocument<TModel>> {
    return this.model.create(modelData);
  }

  find(
    filterQuery: FilterQuery<HydratedDocument<TModel>>,
    options: QueryOptions = {},
  ): Promise<HydratedDocument<TModel>[]> {
    return this.model.find(filterQuery, options).exec();
  }

  findOne(
    filterQuery: FilterQuery<HydratedDocument<TModel>>,
    options: QueryOptions = {},
  ): Promise<HydratedDocument<TModel> | null> {
    return this.model.findOne(filterQuery, options).exec();
  }

  findById(id: string): Promise<HydratedDocument<TModel> | null> {
    return this.model.findById(id).exec();
  }

  findOneAndUpdate(
    filterQuery: FilterQuery<HydratedDocument<TModel>>,
    updateQuery: UpdateQuery<HydratedDocument<TModel>>,
  ): Promise<HydratedDocument<TModel> | null> {
    return this.model
      .findOneAndUpdate(filterQuery, updateQuery, { new: true })
      .exec();
  }

  findOneAndDelete(
    filterQuery: FilterQuery<HydratedDocument<TModel>>,
  ): Promise<HydratedDocument<TModel> | null> {
    return this.model.findOneAndDelete(filterQuery).exec();
  }
}
