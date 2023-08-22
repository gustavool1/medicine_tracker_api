import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pill } from '../entity/pill.entity';
import { Medicine } from 'src/modules/medicines/entity/medicine.entity';
import { PillsByDatePayload } from '../dtos/pills-by-date-payload';

@Injectable()
export class PillServices {
  constructor(
    @InjectRepository(Pill)
    private readonly pillsRepository: Repository<Pill>,

    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  async getPillsByDay(data: PillsByDatePayload): Promise<Pill[]> {
    const pills = [];
    const medicines = await this.medicineRepository.find({
      where: { userId: data.userId },
    });

    await Promise.all(
      medicines.map(async (medicine) => {
        const pill = await this.pillsRepository.find({
          where: { medicineId: medicine.id, takePillDay: data.date },
        });
        if (pill) pills.push(...pill);
      }),
    );

    return pills;
  }

  async takePill(pillId: string) {
    const pill = await this.pillsRepository.findOne({ where: { id: pillId } });
    pill.isTaken = true;
    await this.pillsRepository.save(pill);

    if (pill) return { message: 'sucess', statusCode: 200 };
  }
}