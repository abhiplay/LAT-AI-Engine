import { Controller, Get } from '@nestjs/common';
import { GradeService } from './grade.service';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }
}
