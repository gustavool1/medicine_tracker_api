import { IsNotEmpty } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  frequency: number;

  @IsNotEmpty()
  until: Date;
}
