import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PillServices } from '../services/pills.services';
import { Pill } from '../entity/pill.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import jwt_decode from 'jwt-decode';

@Controller('pill')
export class PillController {
  constructor(private readonly pillServices: PillServices) {}

  @UseGuards(AuthGuard)
  @Get('byDay/:date')
  async getPillsByDay(@Param('date') date: Date, @Req() req): Promise<Pill[]> {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt_decode(token);

    return await this.pillServices.getPillsByDay({
      userId: decodedToken['id'],
      date,
    });
  }

  @UseGuards(AuthGuard)
  @Get('takePill/:id')
  async takePill(@Param('id') pillId: string) {
    await this.pillServices.takePill(pillId);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getPillById(@Param('id') pillId: number): Promise<Pill> {
    const result = await this.pillServices.getPillById(pillId);
    return result;
  }
}
