import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicinesController } from './controllers/medicines.controller';
import { MedicinesServices } from './services/medicines.services';
import { Medicine, Pill } from './entity/entities';

@Module({
  controllers: [MedicinesController],
  providers: [MedicinesServices],
  imports: [TypeOrmModule.forFeature([Medicine, Pill])],
})
export class MedicineModule {}
