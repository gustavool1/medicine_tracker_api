import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DataSource, DataSourceOptions } from 'typeorm';

export default class Database {
  static async build() {
    return TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.entity.js'],
      autoLoadEntities: false,
      synchronize: false,
      timezone: 'Z',
      migrationsRun: false,
      migrations: [`${__dirname}/migration/{.ts,*.js}`],
    });
  }
  static buildSettings(): DataSourceOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/src/modules/**/entities/*{.ts,.js}'],
      synchronize: false,
      timezone: 'Z',
      migrationsRun: true,
      migrations: [`${__dirname}/migration/{.ts,*.js}`],
    };
  }

  static registerEntities(entities: EntityClassOrSchema[]) {
    return TypeOrmModule.forFeature(entities);
  }
}

export const dataSource: DataSource = new DataSource(Database.buildSettings());
