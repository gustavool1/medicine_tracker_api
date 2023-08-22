import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medicine } from './medicine.entity';

@Entity('pills')
export class Pill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @JoinColumn()
  @Column()
  name: string;

  @Column({ name: 'is_taken' })
  isTaken: boolean;

  @Column({ name: 'medicine_id' })
  medicineId: string;

  @Column({ name: 'take_pill_day' })
  takePillDay: Date;

  @ManyToOne(() => Pill)
  @JoinColumn({ name: 'medicine_id', referencedColumnName: 'id' })
  medicine: Medicine;
}
