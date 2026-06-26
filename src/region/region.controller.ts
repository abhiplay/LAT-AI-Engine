import { Controller, Get, UseGuards } from '@nestjs/common';
import { RegionService } from './region.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('regions')
@UseGuards(JwtAuthGuard)
export class RegionController {
  constructor(private service: RegionService) {}

  @Get()
  findAll() { return this.service.findAll(); }
}
