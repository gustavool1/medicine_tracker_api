import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Medicine } from '../../medicines/entity/medicine.entity';

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

  constructor(pill: Partial<Pill>) {
    this.id = pill?.id;
    this.name = pill?.name;
    this.isTaken = pill?.isTaken;
    this.medicineId = pill?.medicineId;
    this.takePillDay = pill?.takePillDay;
    this.medicine = pill?.medicine;
  }
}
