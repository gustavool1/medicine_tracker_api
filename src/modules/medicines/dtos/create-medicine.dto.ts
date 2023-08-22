import { IsNotEmpty } from 'class-validator';

export class CreateMedicineDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  frequency: number;

  @IsNotEmpty()
  until: Date;
}
