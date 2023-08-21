import { Users } from 'src/modules/users/entity/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Medicine {
  @ManyToOne(() => Users, (user) => user.medicines)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  frequency: number;

  @Column()
  until: Date;
}
