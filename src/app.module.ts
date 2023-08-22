import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Database from './database';
import { ConfigModule } from '@nestjs/config';
import { UsersModule, MedicineModule, PillModule } from './modules/modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    Database.build(),
    UsersModule,
    MedicineModule,
    PillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
