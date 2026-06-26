import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TestSession } from './test-session.entity';
import { StudentResponse } from './student-response.entity';
import { Question, QuestionStatus } from '../question/question.entity';

const LAT_CONFIG: Record<number, { total: number; durationMin: number }> = {
  1: { total: 45, durationMin: 120 }, // Class 3
  2: { total: 51, durationMin: 150 }, // Class 6
  3: { total: 60, durationMin: 190 }, // Class 9
};

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestSession) private sessionRepo: Repository<TestSession>,
    @InjectRepository(StudentResponse) private responseRepo: Repository<StudentResponse>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async startTest(student: { id: number; name: string; gradeId: number; gradeName: string; schoolId: number; regionId: number }) {
    const config = LAT_CONFIG[student.gradeId];
    if (!config) throw new BadRequestException(`No LAT config for gradeId ${student.gradeId}`);

    const approvedQs = await this.questionRepo.find({ where: { gradeId: student.gradeId, status: QuestionStatus.APPROVED } });
    if (approvedQs.length < config.total) {
      throw new BadRequestException(`Not enough approved questions. Need ${config.total}, have ${approvedQs.length}`);
    }

    const shuffled = approvedQs.sort(() => Math.random() - 0.5).slice(0, config.total);

    const session = await this.sessionRepo.save(this.sessionRepo.create({
      studentId: student.id, studentName: student.name,
      gradeId: student.gradeId, gradeName: student.gradeName,
      schoolId: student.schoolId, regionId: student.regionId,
      totalQuestions: config.total, completed: false,
    }));

    return {
      sessionId: session.id,
      durationMinutes: config.durationMin,
      totalQuestions: config.total,
      questions: shuffled.map(q => ({
        id: q.id, questionText: q.questionText, options: q.options,
        subjectName: q.subjectName, competencyCode: q.competencyCode,
        questionType: q.questionType, imageUrl: q.imageUrl,
        imageDescription: q.imageDescription, patternData: q.patternData,
        chartData: q.chartData, clockData: (q as any).clockData, scaleData: (q as any).scaleData,
      })),
    };
  }

  async submitTest(sessionId: number, studentId: number, responses: { questionId: number; selectedAnswer: string }[], timeTakenSeconds: number) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId, studentId } });
    if (!session) throw new NotFoundException('Test session not found');
    if (session.completed) throw new BadRequestException('Test already submitted');

    const questionIds = responses.map(r => r.questionId);
    const questions = await this.questionRepo.find({ where: { id: In(questionIds) } });
    const qMap = new Map(questions.map(q => [q.id, q]));

    let score = 0;
    const savedResponses = await Promise.all(responses.map(async (r) => {
      const q = qMap.get(r.questionId);
      if (!q) return null;
      const isCorrect = r.selectedAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return this.responseRepo.save(this.responseRepo.create({
        sessionId, questionId: r.questionId,
        questionText: q.questionText,
        subjectName: q.subjectName, competencyCode: q.competencyCode,
        selectedAnswer: r.selectedAnswer || '',
        correctAnswer: q.correctAnswer, isCorrect,
        skipped: !r.selectedAnswer,
      }));
    }));

    await this.sessionRepo.update(sessionId, {
      score, attempted: responses.filter(r => r.selectedAnswer).length,
      timeTakenSeconds, completed: true, completedAt: new Date(),
    });

    return { sessionId, score, total: session.totalQuestions, percentage: Math.round((score / session.totalQuestions) * 100) };
  }

  async getMyResults(studentId: number) {
    const sessions = await this.sessionRepo.find({ where: { studentId, completed: true }, order: { startedAt: 'DESC' } });
    return sessions;
  }

  async getSessionDetail(sessionId: number, studentId: number) {
    const session = await this.sessionRepo.findOne({ where: { id: sessionId, studentId } });
    if (!session) throw new NotFoundException('Session not found');
    const responses = await this.responseRepo.find({ where: { sessionId } });
    return { session, responses };
  }

  async getReports(filters: { regionId?: number; schoolId?: number; gradeId?: number }) {
    const qb = this.sessionRepo.createQueryBuilder('s').where('s.completed = true');
    if (filters.regionId) qb.andWhere('s.regionId = :regionId', { regionId: filters.regionId });
    if (filters.schoolId) qb.andWhere('s.schoolId = :schoolId', { schoolId: filters.schoolId });
    if (filters.gradeId) qb.andWhere('s.gradeId = :gradeId', { gradeId: filters.gradeId });

    const sessions = await qb.getMany();
    const total = sessions.length;
    if (total === 0) return { total: 0, avgScore: 0, avgPercentage: 0, sessions: [] };

    const avgScore = sessions.reduce((s, x) => s + x.score, 0) / total;
    const avgPercentage = sessions.reduce((s, x) => s + Math.round((x.score / x.totalQuestions) * 100), 0) / total;

    return { total, avgScore: Math.round(avgScore * 10) / 10, avgPercentage: Math.round(avgPercentage), sessions };
  }
}
