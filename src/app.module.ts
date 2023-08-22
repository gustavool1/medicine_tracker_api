import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from './database';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, MedicineModule } from './modules/modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    UsersModule,
    MedicineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
