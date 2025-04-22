import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  create(user: User) {
    return this.userRepository.create(user);
  }

  getUserById(id: number): Promise<User> {
    return this.userRepository.findById(id);
  }

  getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  
}
