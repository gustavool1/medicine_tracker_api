import { Body, Controller, Post } from '@nestjs/common';
import { MedicinesServices } from '../services/medicines.services';
import { CreateMedicineDto, CreateMedicineResponseDto } from '../dtos/dtos';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesServices: MedicinesServices) {}

  @Post()
  async createMedicines(
    @Body() data: CreateMedicineDto,
  ): Promise<CreateMedicineResponseDto> {
    return await this.medicinesServices.createMedicine(data);
  }
}
