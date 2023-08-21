import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { CreateUserDto, SignInDto } from '../dtos/dtos';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/errors/app-error';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async deleteUserById(id: string) {
    await this.usersRepository.delete({ id: id });
  }

  async deleteUserByEmail(email: string) {
    await this.usersRepository.delete({ email: email });
  }

  async createUser(userData: CreateUserDto): Promise<Users> {
    const hasUserWithThisEmail = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (hasUserWithThisEmail) {
      throw new AppError('An account with this email already exists', 409);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    delete userData.password;

    const user = await this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async signIn(signInData: SignInDto): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { email: signInData.email },
    });

    if (!user) {
      throw new AppError('An user with this email dont exist', 404);
    }
    const passwordMatchesHash = await bcrypt.compare(
      signInData.password,
      user.passwordHash,
    );

    if (!passwordMatchesHash) {
      throw new AppError('Password incorrect', 400);
    }
    return user;
  }
}
