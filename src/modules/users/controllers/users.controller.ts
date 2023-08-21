import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.service';
import { CreateUserDto } from '../dtos/dtos';
import { Users } from '../entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return await this.usersServices.createUser(data);
  }

  @Get()
  async getUser() {
    return await this.usersServices.getUsers();
  }
}
