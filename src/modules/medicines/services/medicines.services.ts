import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Medicine } from '../entity/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { addDays } from 'date-fns';
import { Pill } from '../../pill/entity/pill.entity';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class MedicinesServices {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,

    @InjectRepository(Pill)
    private readonly pillRepository: Repository<Pill>,
  ) {}

  async createMedicine(medicinePayload): Promise<Medicine> {
    const today = new Date();
    if (
      new Date(medicinePayload.until) < today ||
      new Date(medicinePayload.from) > new Date(medicinePayload.until)
    ) {
      throw new AppError(
        "You can't create an medicine to a date in the past.",
        400,
      );
    }
    const medicine = new Medicine({
      name: medicinePayload.name,
      frequency: medicinePayload.frequency,
      until: medicinePayload.until,
      from: medicinePayload.from,
      userId: medicinePayload.userId,
    });

    const medicineSaved = await this.medicineRepository.create(medicine);
    await this.medicineRepository.save(medicineSaved);

    const pills = await this.createPillsUntilGivenDate(
      new Date(medicineSaved.until),
      medicineSaved,
      medicinePayload.reminders,
    );
    medicineSaved.pills = pills;

    return medicineSaved;
  }

  async getMedicinesPills(medicineId: string): Promise<Pill[]> {
    return await this.pillRepository.find({
      where: {
        medicineId: medicineId,
      },
    });
  }

  async getUserMedicines(userId: string): Promise<Medicine[]> {
    return await this.medicineRepository.find({
      where: {
        userId,
      },
      relations: ['pills'],
    });
  }

  async createPillsUntilGivenDate(
    endDate: Date,
    medicine: Medicine,
    reminders: string[],
  ): Promise<Pill[]> {
    let startDate = new Date(medicine.from);
    const limitDate = addDays(startDate, 30);
    const pills: Pill[] = [];
    while (startDate <= endDate && startDate < limitDate) {
      for (let i = 0; i < medicine.frequency; i++) {
        const pill = new Pill({
          name: medicine.name,
          medicineId: medicine.id,
          isTaken: false,
          takePillDay: startDate,
          takePillHour: reminders[i],
        });

        const savedPill = await this.pillRepository.create(pill);
        await this.pillRepository.save(savedPill);
        pills.push(savedPill);
      }
      startDate = addDays(startDate, 1);
    }
    return pills;
  }
}
