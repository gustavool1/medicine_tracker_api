import { Controller, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}
  @Post()
  async createUser() {
    return await this.usersServices.getUsers();
  }
}
