import { Users } from 'src/modules/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Pill } from '../../pill/entity/pill.entity';

@Entity('medicines')
export class Medicine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  name: string;

  @Column()
  frequency: number;

  @Column()
  until: Date;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;

  @OneToMany(() => Pill, (pills) => pills.medicine)
  pills: Pill[];

  constructor(medicine: Partial<Medicine>) {
    this.id = medicine?.id;
    this.createdAt = medicine?.createdAt;
    this.name = medicine?.name;
    this.frequency = medicine?.frequency;
    this.until = medicine?.until;
    this.userId = medicine?.userId;
    this.user = medicine?.user;
    this.pills = medicine?.pills;
  }
}
