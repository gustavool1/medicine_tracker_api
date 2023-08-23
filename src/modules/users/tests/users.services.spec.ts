import { Test, TestingModule } from '@nestjs/testing';
import { UsersServices } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user-request';
import { AppError } from 'src/errors/app-error';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

const user: Users = new Users({
  id: '123',
  createdAt: new Date(),
  email: 'gustavo@gmail.com',
  medicines: [],
  name: 'Gustavo',
  passwordHash: 'hash',
});

const createUserPayload: CreateUserDto = {
  name: 'bruno',
  email: 'gustavo@gmail.com',
  password: '123456xx',
};

const mockJwtService = {
  signAsync: jest.fn(),
};

describe('UsersService', () => {
  let usersServices: UsersServices;
  let usersRepository: Repository<Users>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersServices,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(user),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersServices = module.get<UsersServices>(UsersServices);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('Should be defined', () => {
    expect(usersServices).toBeDefined();
  });

  describe('createUser', () => {
    it('Should create an user', async () => {
      usersRepository.findOne = jest.fn().mockReturnValue(null);

      const response = await usersServices.createUser(createUserPayload);

      expect(response).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        passwordHash: expect.any(String),
        id: expect.any(String),
        createdAt: expect.any(Date),
      });

      expect(usersRepository.findOne).toBeCalledTimes(1);
      expect(usersRepository.save).toBeCalledTimes(1);
    });

    it('Should throw an error with status code 409 that the email already exists', async () => {
      usersRepository.findOne = jest.fn().mockReturnValue(user);
      try {
        await usersServices.createUser(createUserPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(409);
      }
    });
  });

  describe('signIn', () => {
    const signInData = { email: 'gustavo@gmail.com', password: '123456' };

    it('Should sign in with the user and return an SignInResponse', async () => {
      user.passwordHash = await bcrypt.hash(signInData.password, 10);

      jwtService.signAsync = () => Promise.resolve('randomjwt');
      usersRepository.findOne = jest.fn().mockReturnValue(user);

      const response = await usersServices.signIn(signInData);

      expect(response).toMatchObject({
        accessToken: expect.any(String),
        id: expect.any(String),
      });
    });

    it('Should return an AppError with the message user with this email dont exist and status code 409', async () => {
      try {
        await usersServices.signIn(signInData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(404);
      }
    });

    it('Should return an AppError with the message Password incorrect and status code 400', async () => {
      try {
        const compareMock = jest.spyOn(bcrypt, 'compare') as jest.Mock;
        compareMock.mockResolvedValue(false);

        usersRepository.findOne = jest.fn().mockReturnValue(user);
        await usersServices.signIn(signInData);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
