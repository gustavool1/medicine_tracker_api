import { Body, Controller, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.service';
import { CreateUserDto, SignInDto } from '../dtos/dtos';
import { Users } from '../entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return await this.usersServices.createUser(data);
  }

  @Post('/signIn')
  async signIn(@Body() data: SignInDto): Promise<Users> {
    return await this.usersServices.signIn(data);
  }
}
