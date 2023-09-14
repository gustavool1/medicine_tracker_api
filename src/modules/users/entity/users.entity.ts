import { Medicine } from 'src/modules/medicines/entity/medicine.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Medicine, (medicine) => medicine.user)
  medicines: Medicine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  constructor(user: Partial<Users>) {
    this.id = user?.id;
    this.medicines = user?.medicines;
    this.createdAt = user?.createdAt;
    this.name = user?.name;
    this.email = user?.email;
    this.passwordHash = user?.passwordHash;
    this.refreshToken = user?.refreshToken;
  }
}
