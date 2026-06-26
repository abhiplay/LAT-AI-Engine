import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('schools')
@UseGuards(JwtAuthGuard)
export class SchoolController {
  constructor(private service: SchoolService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('region/:regionId')
  findByRegion(@Param('regionId') regionId: string) {
    return this.service.findByRegion(+regionId);
  }
}
