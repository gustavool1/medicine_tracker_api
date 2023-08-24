import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Medicine } from '../entity/medicine.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicinesByDatePayload } from '../dtos/medicines-by-date.dto';
import { addDays } from 'date-fns';
import { Pill } from '../../pill/entity/pill.entity';

@Injectable()
export class MedicinesServices {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,

    @InjectRepository(Pill)
    private readonly pillRepository: Repository<Pill>,
  ) {}

  async createMedicine(medicinePayload): Promise<Medicine> {
    const medicine = new Medicine({
      name: medicinePayload.name,
      frequency: medicinePayload.frequency,
      until: medicinePayload.until,
      userId: medicinePayload.userId,
    });

    const medicineSaved = await this.medicineRepository.create(medicine);
    await this.medicineRepository.save(medicineSaved);

    const pills = await this.createPillsUntilGivenDate(
      new Date(medicineSaved.until),
      medicineSaved,
    );
    medicineSaved.pills = pills;

    return medicineSaved;
  }

  async getUsersMedicines(userId: string, date?: Date) {
    return await this.medicineRepository.find({
      where: { userId, createdAt: date },
    });
  }

  async getUsersMedicinesByDate(
    medicinesByDatePayload: MedicinesByDatePayload,
  ) {
    return await this.getUsersMedicines(
      medicinesByDatePayload.userId,
      medicinesByDatePayload.date,
    );
  }

  async createPillsUntilGivenDate(
    endDate: Date,
    medicine: Medicine,
  ): Promise<Pill[]> {
    let startDate = medicine.createdAt;
    const limitDate = addDays(startDate, 30);
    const pills: Pill[] = [];
    while (startDate < endDate && startDate < limitDate) {
      const pill = new Pill({
        name: medicine.name,
        medicineId: medicine.id,
        isTaken: false,
        takePillDay: startDate,
      });

      const savedPill = await this.pillRepository.create(pill);
      await this.pillRepository.save(savedPill);
      pills.push(savedPill);

      startDate = addDays(startDate, 1);
    }
    return pills;
  }
}
