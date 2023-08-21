import { Test, TestingModule } from '@nestjs/testing';
import { UsersServices } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from '../dtos/dtos';

describe('UsersServices', () => {
  let usersServices: UsersServices;
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          entities: [__dirname + '/../**/*.entity.ts'],
          autoLoadEntities: false,
          synchronize: false,
          timezone: 'Z',
          migrationsRun: false,
          migrations: [`${__dirname}/migration/{.ts,*.js}`],
        }),
        TypeOrmModule.forFeature([Users]),
      ],
      providers: [UsersServices],
    }).compile();

    usersServices = moduleRef.get<UsersServices>(UsersServices);
  });

  describe('createUser', () => {
    const userCreatePayload: CreateUserDto = {
      email: 'abcdef@gmail.com',
      name: 'gustavo',
      password: '1234',
    };

    it('Should create an user and return it', async () => {
      const user = await usersServices.createUser(userCreatePayload);
      expect(user).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        passwordHash: expect.any(String),
        id: expect.any(String),
        createdAt: expect.any(Date),
      });
    });

    it('Should return 409, because an account with this email already exists', async () => {
      try {
        await usersServices.createUser(userCreatePayload);
        fail('Expected createUser to throw an error');
      } catch (error) {
        expect(error).toMatchObject({
          message: expect.any(String),
          statusCode: 409,
        });
        await usersServices.deleteUserByEmail(userCreatePayload.email);
      }
    });
  });
});
