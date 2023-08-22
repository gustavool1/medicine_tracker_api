import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PillServices } from '../services/pills.services';
import { PillsByDatePayload } from '../dtos/pills-by-date-payload';
import { Pill } from '../entity/pill.entity';

@Controller('pill')
export class PillController {
  constructor(private readonly pillServices: PillServices) {}

  @Post('byDay')
  async getPillsByDay(@Body() data: PillsByDatePayload): Promise<Pill[]> {
    return await this.pillServices.getPillsByDay(data);
  }

  @Get('takePill/:id')
  async takePill(@Param('id') pillId: string) {
    await this.pillServices.takePill(pillId);
  }
}
