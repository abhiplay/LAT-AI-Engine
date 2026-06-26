import { Controller, Post, Get, Patch, Body, Param } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionStatus } from './question.entity';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('generate')
  generate(@Body() body: any) {
    return this.questionService.generate(body);
  }

  @Post('save')
  save(@Body() body: any) {
    return this.questionService.save(body);
  }

  @Get('review')
  findPending() {
    return this.questionService.findPending();
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.questionService.updateStatus(+id, QuestionStatus.APPROVED);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.questionService.updateStatus(+id, QuestionStatus.REJECTED, body.reason);
  }
}
