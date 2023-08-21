import { Test, TestingModule } from '@nestjs/testing';
import { UsersServices } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from '../dtos/dtos';

describe('UsersServices', () => {
  let usersServices: UsersServices;
  let moduleRef: TestingModule;

  const userCreatePayload: CreateUserDto = {
    email: 'abcdef@gmail.com',
    name: 'gustavo',
    password: '1234',
  };

  const userMatchedObject = {
    name: expect.any(String),
    email: expect.any(String),
    passwordHash: expect.any(String),
    id: expect.any(String),
    createdAt: expect.any(Date),
  };

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
    it('Should create an user and return it', async () => {
      const user = await usersServices.createUser(userCreatePayload);
      expect(user).toMatchObject(userMatchedObject);
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

  describe('signIn', () => {
    it('Should sign in correctly and return an user', async () => {
      const userPassword = '1234';
      const user = await usersServices.createUser({
        email: 'abcdef@gmail.com',
        name: 'gustavo',
        password: userPassword,
      });

      const signInResult = await usersServices.signIn({
        email: user.email,
        password: userPassword,
      });

      expect(signInResult).toMatchObject(userMatchedObject);
    });

    it('Should return 404, because a user with this email was not found', async () => {
      try {
        await usersServices.signIn({
          email: 'wrongemail@gmail',
          password: 'randompassword',
        });

        fail('Expected signIn to throw an error');
      } catch (error) {
        expect(error).toMatchObject({
          message: expect.any(String),
          statusCode: 404,
        });
      }
    });

    it('Should return 400, because the password is incorrect', async () => {
      try {
        await usersServices.signIn({
          email: userCreatePayload.email,
          password: 'wrongpassword',
        });
        await usersServices.deleteUserByEmail(userCreatePayload.email);
        fail('Expected signIn to throw an error');
      } catch (error) {
        expect(error).toMatchObject({
          message: expect.any(String),
          statusCode: 400,
        });

        await usersServices.deleteUserByEmail(userCreatePayload.email);
      }
    });
  });
});
