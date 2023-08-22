import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Medicine } from '../entity/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMedicineDto } from '../dtos/create-medicine.dto';
import { MedicinesByDatePayload } from '../dtos/medicines-by-date.dto';
import { addDays } from 'date-fns';
import { Pill } from '../entity/pill.entity';
import { CreateMedicineResponseDto } from '../dtos/create-medicine-response.dto';

@Injectable()
export class MedicinesServices {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,

    @InjectRepository(Pill)
    private readonly pillRepository: Repository<Pill>,
  ) {}

  async createMedicine(
    medicinePayload: CreateMedicineDto,
  ): Promise<CreateMedicineResponseDto> {
    const medicine = new Medicine();
    medicine.name = medicinePayload.name;
    medicine.frequency = medicinePayload.frequency;
    medicine.until = medicinePayload.until;
    medicine.userId = medicinePayload.userId;

    const medicineSaved = await this.medicineRepository.create(medicine);
    await this.medicineRepository.save(medicineSaved);

    const pills = await this.createPillsUntilGivenDate(
      new Date(medicineSaved.until),
      medicineSaved,
    );

    return { medicine: { ...medicineSaved }, pills };
  }

  async createPillsUntilGivenDate(
    endDate: Date,
    medicine: Medicine,
  ): Promise<Pill[]> {
    let startDate = medicine.createdAt;
    const limitDate = addDays(startDate, 30);
    const pills: Pill[] = [];

    while (startDate < endDate && startDate < limitDate) {
      const pill = new Pill();
      pill.name = medicine.name;
      pill.medicineId = medicine.id;
      pill.isTaken = false;
      pill.takePillDay = startDate;

      const savedPill = await this.pillRepository.create(pill);
      await this.pillRepository.save(savedPill);
      pills.push(savedPill);

      startDate = addDays(startDate, 1);
    }
    return pills;
  }
}
