import { Controller, Get, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get('stats')
  getStats() {
    return this.feedbackService.getStats();
  }

  @Get('similar')
  getSimilar(
    @Query('competencyCode') competencyCode: string,
    @Query('gradeName') gradeName: string,
    @Query('subjectName') subjectName: string,
    @Query('queryText') queryText: string,
  ) {
    return this.feedbackService.getSimilarApproved(competencyCode, gradeName, subjectName, queryText);
  }
}
