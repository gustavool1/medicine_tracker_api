import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async getUsers() {
    return await this.usersRepository.find();
  }

  async createUser() {
    return await this.usersRepository.find();
  }
}
