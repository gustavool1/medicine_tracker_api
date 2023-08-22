import { IsNotEmpty } from 'class-validator';

export class PillsByDatePayload {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  date: Date;
}
