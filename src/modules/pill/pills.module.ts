import { Module } from '@nestjs/common';
import { PillServices } from './services/pills.services';
import { PillController } from './controllers/pills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pill } from './entity/pill.entity';
import { Medicine } from '../medicines/entity/medicine.entity';

@Module({
  providers: [PillServices],
  controllers: [PillController],
  imports: [TypeOrmModule.forFeature([Pill, Medicine])],
})
export class PillModule {}
