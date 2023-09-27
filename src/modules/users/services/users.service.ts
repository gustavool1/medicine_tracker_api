import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entity/users.entity';
import { CreateUserDto, SignInDto, SignInResponse } from '../dtos/dtos';
import * as bcrypt from 'bcrypt';
import { AppError } from 'src/errors/app-error';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersServices {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
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
      refreshToken: '',
    });

    await this.usersRepository.save(user);

    return user;
  }

  async signIn(signInData: SignInDto): Promise<SignInResponse> {
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
    const refreshToken = await this.jwtService.signAsync(
      {
        ...signInData,
        id: user.id,
      },
      {
        expiresIn: process.env.JWT_EXPIRES_REFRESH,
        secret: process.env.JWT_SECRET_REFRESH,
      },
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;
    this.usersRepository.save(user);

    return {
      accessToken: await this.jwtService.signAsync(
        {
          ...signInData,
          id: user.id,
        },
        {
          expiresIn: process.env.JWT_EXPIRES_SECRET_TOKEN,
          secret: process.env.JWT_SECRET_TOKEN,
        },
      ),
      refreshToken,
      id: user.id,
    };
  }

  async refresh(refreshToken: string): Promise<any> {
    const decoded = this.jwtService.decode(refreshToken);
    if (!decoded) {
      throw new AppError('Invalid token', 401);
    }

    const user = await this.usersRepository.findOne({
      where: { email: decoded['email'] },
    });

    if (!user) {
      throw new AppError('User with this id does not exist', 404);
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new AppError('Invalid token', 401);
    }

    delete user.passwordHash;
    delete user.refreshToken;

    const refreshedToken = await this.jwtService.signAsync(
      { ...user },
      {
        expiresIn: process.env.JWT_EXPIRES_SECRET_TOKEN,
        secret: process.env.JWT_SECRET_TOKEN,
      },
    );
    return { accessToken: refreshedToken };
  }
}
