import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { Users } from './entity/users.entity';
import { UsersServices } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersServices],
  imports: [TypeOrmModule.forFeature([Users])],
})
export class UsersModule {}
