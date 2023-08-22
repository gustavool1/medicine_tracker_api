import { IsNotEmpty } from 'class-validator';

export class MedicinesByDatePayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  date: Date;
}
