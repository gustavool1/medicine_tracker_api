import { IsNotEmpty } from 'class-validator';
import { Medicine } from '../entity/medicine.entity';
import { Pill } from '../entity/pill.entity';

export class CreateMedicineResponseDto {
  @IsNotEmpty()
  medicine: Medicine;

  @IsNotEmpty()
  pills: Pill[];
}
