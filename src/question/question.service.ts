import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionStatus } from './question.entity';
import { LlmService } from './llm.service';
import { FeedbackService } from '../feedback/feedback.service';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question) private repo: Repository<Question>,
    private llmService: LlmService,
    private feedbackService: FeedbackService,
  ) {}

  async generate(dto: {
    gradeId: number; gradeName: string;
    subjectId: number; subjectName: string;
    competencyId: number; competencyCode: string; competencyDescription: string;
    llm: string; instructions: string; questionType: string;
  }) {
    const feedbackContext = await this.feedbackService.getSimilarApproved(
      dto.competencyCode, dto.gradeName, dto.subjectName,
      `${dto.competencyCode}: ${dto.competencyDescription}`,
    );

    const mcq = await this.llmService.generate(
      dto.llm, dto.gradeName, dto.subjectName,
      `${dto.competencyCode}: ${dto.competencyDescription}`,
      dto.instructions,
      dto.questionType,
      feedbackContext,
    );
    return { ...mcq, llmUsed: dto.llm, questionType: dto.questionType };
  }

  async save(dto: {
    gradeId: number; gradeName: string;
    subjectId: number; subjectName: string;
    competencyId: number; competencyCode: string; competencyDescription: string;
    questionText: string; options: { key: string; value: string }[];
    correctAnswer: string; explanation: string; llmUsed: string; questionType: string;
    imageUrl?: string; imagePrompt?: string; imageDescription?: string;
    patternData?: { shape: string; color: string; size: string }[];
    chartData?: { title: string; yLabel: string; bars: { label: string; value: number }[] };
    clockData?: { hours: number; minutes: number; label?: string };
    scaleData?: object;
  }) {
    const question = this.repo.create({ ...dto, status: QuestionStatus.PENDING });
    return this.repo.save(question);
  }

  findPending() {
    return this.repo.find({ where: { status: QuestionStatus.PENDING }, order: { createdAt: 'DESC' } });
  }

  findAll() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async updateStatus(id: number, status: QuestionStatus, rejectionReason?: string) {
    await this.repo.update(id, { status, rejectionReason: rejectionReason ?? undefined });
    const question = await this.repo.findOne({ where: { id } });

    if (question) {
      await this.feedbackService.recordFeedback({
        id: question.id,
        competencyCode: question.competencyCode,
        gradeName: question.gradeName,
        subjectName: question.subjectName,
        questionType: question.questionType,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        llmUsed: question.llmUsed,
      }, status as 'approved' | 'rejected', rejectionReason);
    }

    return question;
  }
}
