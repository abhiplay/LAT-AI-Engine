import { Controller, Get, Param } from '@nestjs/common';
import { CompetencyService } from './competency.service';

@Controller('competencies')
export class CompetencyController {
  constructor(private readonly competencyService: CompetencyService) {}

  @Get('subject/:subjectId')
  findBySubject(@Param('subjectId') subjectId: string) {
    return this.competencyService.findBySubject(+subjectId);
  }
}
