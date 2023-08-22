import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MedicinesServices } from '../services/medicines.services';
import {
  CreateMedicineDto,
  CreateMedicineResponseDto,
  MedicinesByDatePayload,
} from '../dtos/dtos';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesServices: MedicinesServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMedicines(
    @Body() data: CreateMedicineDto,
    @Req() req,
  ): Promise<CreateMedicineResponseDto> {
    return await this.medicinesServices.createMedicine({
      ...data,
      userId: req.user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/medicinesByDate')
  async getUsersMedicinesByDate(@Body() data: MedicinesByDatePayload) {
    return await this.medicinesServices.getUsersMedicinesByDate(data);
  }
}
