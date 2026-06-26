import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestSession } from './test-session.entity';
import { StudentResponse } from './student-response.entity';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { Question } from '../question/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TestSession, StudentResponse, Question])],
  providers: [TestService],
  controllers: [TestController],
})
export class TestModule {}
