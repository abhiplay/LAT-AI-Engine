import { Controller, Get, Param } from '@nestjs/common';
import { SubjectService } from './subject.service';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get('grade/:gradeId')
  findByGrade(@Param('gradeId') gradeId: string) {
    return this.subjectService.findByGrade(+gradeId);
  }
}
