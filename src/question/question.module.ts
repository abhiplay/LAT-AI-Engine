import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { LlmService } from './llm.service';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question]), FeedbackModule],
  controllers: [QuestionController],
  providers: [QuestionService, LlmService],
})
export class QuestionModule {}
