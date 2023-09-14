import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.service';
import { CreateUserDto, SignInDto, SignInResponse } from '../dtos/dtos';
import { Users } from '../entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}
  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<Users> {
    return await this.usersServices.createUser(data);
  }

  @Post('/signIn')
  async signIn(@Body() data: SignInDto): Promise<SignInResponse> {
    return await this.usersServices.signIn(data);
  }

  @Get('/:token')
  async refreshToken(@Param('token') token: string) {
    return this.usersServices.refresh(token);
  }
}
