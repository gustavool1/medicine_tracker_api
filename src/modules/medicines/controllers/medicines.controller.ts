import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MedicinesServices } from '../services/medicines.services';
import { CreateMedicineDto } from '../dtos/dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { Medicine } from '../entity/medicine.entity';
import jwt_decode from 'jwt-decode';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly medicinesServices: MedicinesServices) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMedicines(
    @Body() data: CreateMedicineDto,
    @Req() req,
  ): Promise<Medicine> {
    return await this.medicinesServices.createMedicine({
      ...data,
      userId: req.user.id,
    });
  }

  @UseGuards(AuthGuard)
  @Get()
  async getUserMedicines(@Req() req): Promise<Medicine[]> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt_decode(token);

    return await this.medicinesServices.getUserMedicines(decodedToken['id']);
  }

  @UseGuards(AuthGuard)
  @Get('/pills/:medicineId')
  async getUsersMedicinesByDate(@Param('medicineId') medicineId: string) {
    return await this.medicinesServices.getMedicinesPills(medicineId);
  }

  @Get('/:medicineId')
  async deleteMedicineById(@Param('medicineId') id: string) {
    return await this.medicinesServices.deleteMedicineById(id);
  }
}
