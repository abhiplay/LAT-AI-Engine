import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { QuestionFeedback } from './question-feedback.entity';

export interface FeedbackContext {
  approvedExamples: QuestionFeedback[];
  rejectedExamples: QuestionFeedback[];
}

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);
  private pinecone: Pinecone;
  private openai: OpenAI;
  private indexName: string;

  constructor(
    private config: ConfigService,
    @InjectRepository(QuestionFeedback) private repo: Repository<QuestionFeedback>,
  ) {
    this.indexName = this.config.get('PINECONE_INDEX') ?? 'lat-feedback';

    const pineconeApiKey = this.config.get('PINECONE_API_KEY');
    if (pineconeApiKey) {
      this.pinecone = new Pinecone({ apiKey: pineconeApiKey });
    }

    const openaiKey = this.config.get('OPENAI_API_KEY');
    if (openaiKey) {
      this.openai = new OpenAI({ apiKey: openaiKey });
    }
  }

  private async embed(text: string): Promise<number[]> {
    if (!this.openai) {
      this.logger.warn('OpenAI not configured — skipping embedding');
      return [];
    }
    const res = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return res.data[0].embedding;
  }

  private buildFeedbackText(q: {
    questionText: string;
    options: { key: string; value: string }[];
    correctAnswer: string;
    explanation?: string;
    gradeName: string;
    subjectName: string;
    questionType?: string;
  }): string {
    const optionStr = q.options.map(o => `${o.key}) ${o.value}`).join(' | ');
    return `${q.gradeName} | ${q.subjectName} | ${q.questionType ?? 'mcq'} | ${q.questionText} | Options: ${optionStr} | Answer: ${q.correctAnswer} | Explanation: ${q.explanation ?? ''}`;
  }

  async recordFeedback(question: {
    id: number;
    competencyCode: string;
    gradeName: string;
    subjectName: string;
    questionType?: string;
    questionText: string;
    options: { key: string; value: string }[];
    correctAnswer: string;
    explanation?: string;
    llmUsed: string;
  }, status: 'approved' | 'rejected', rejectionReason?: string): Promise<QuestionFeedback> {
    const feedbackText = this.buildFeedbackText(question);
    const vector = await this.embed(feedbackText);

    let pineconeId = `q-${question.id}`;
    if (this.pinecone && vector.length > 0) {
      try {
        const index = this.pinecone.index(this.indexName);
        await index.upsert([{
          id: pineconeId,
          values: vector,
          metadata: {
            competencyCode: question.competencyCode,
            gradeName: question.gradeName,
            subjectName: question.subjectName,
            questionType: question.questionType ?? 'mcq',
            status,
            questionText: question.questionText.substring(0, 500),
            correctAnswer: question.correctAnswer,
            explanation: (question.explanation ?? '').substring(0, 500),
            rejectionReason: (rejectionReason ?? '').substring(0, 500),
          },
        }]);
      } catch (err) {
        this.logger.error(`Pinecone upsert failed: ${err.message}`);
      }
    }

    return this.repo.save(this.repo.create({
      questionId: question.id,
      competencyCode: question.competencyCode,
      gradeName: question.gradeName,
      subjectName: question.subjectName,
      questionType: question.questionType,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      status,
      rejectionReason,
      pineconeId,
      llmUsed: question.llmUsed,
    }));
  }

  async getSimilarApproved(
    competencyCode: string,
    gradeName: string,
    subjectName: string,
    queryText: string,
    topK = 5,
  ): Promise<FeedbackContext> {
    const approvedExamples: QuestionFeedback[] = [];
    const rejectedExamples: QuestionFeedback[] = [];

    // Try vector search first
    if (this.pinecone && this.openai) {
      try {
        const vector = await this.embed(queryText);
        if (vector.length > 0) {
          const index = this.pinecone.index(this.indexName);

          // Get approved examples
          const approvedRes = await index.query({
            vector,
            topK,
            includeMetadata: true,
            filter: {
              competencyCode,
              status: 'approved',
            },
          });

          for (const match of approvedRes.matches ?? []) {
            const meta = match.metadata as any;
            approvedExamples.push({
              id: 0,
              questionId: 0,
              competencyCode,
              gradeName: meta.gradeName ?? gradeName,
              subjectName: meta.subjectName ?? subjectName,
              questionType: meta.questionType,
              questionText: meta.questionText ?? '',
              options: [],
              correctAnswer: meta.correctAnswer ?? '',
              explanation: meta.explanation ?? '',
              status: 'approved',
              rejectionReason: '',
              pineconeId: match.id,
              llmUsed: '',
              createdAt: new Date(),
            } as QuestionFeedback);
          }

          // Get rejected examples
          const rejectedRes = await index.query({
            vector,
            topK: 3,
            includeMetadata: true,
            filter: {
              competencyCode,
              status: 'rejected',
            },
          });

          for (const match of rejectedRes.matches ?? []) {
            const meta = match.metadata as any;
            rejectedExamples.push({
              id: 0,
              questionId: 0,
              competencyCode,
              gradeName: meta.gradeName ?? gradeName,
              subjectName: meta.subjectName ?? subjectName,
              questionType: meta.questionType,
              questionText: meta.questionText ?? '',
              options: [],
              correctAnswer: meta.correctAnswer ?? '',
              explanation: meta.explanation ?? '',
              status: 'rejected',
              rejectionReason: meta.rejectionReason ?? '',
              pineconeId: match.id,
              llmUsed: '',
              createdAt: new Date(),
            } as QuestionFeedback);
          }

          return { approvedExamples, rejectedExamples };
        }
      } catch (err) {
        this.logger.error(`Pinecone query failed: ${err.message}`);
      }
    }

    // Fallback: query from MySQL
    const approved = await this.repo.find({
      where: { competencyCode, status: 'approved' as any },
      order: { createdAt: 'DESC' },
      take: topK,
    });

    const rejected = await this.repo.find({
      where: { competencyCode, status: 'rejected' as any },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    return { approvedExamples: approved, rejectedExamples: rejected };
  }

  async getStats() {
    const total = await this.repo.count();
    const approved = await this.repo.count({ where: { status: 'approved' as any } });
    const rejected = await this.repo.count({ where: { status: 'rejected' as any } });

    const byCompetency = await this.repo
      .createQueryBuilder('f')
      .select('f.competencyCode', 'competencyCode')
      .addSelect('COUNT(*)', 'total')
      .addSelect("SUM(CASE WHEN f.status = 'approved' THEN 1 ELSE 0 END)", 'approved')
      .addSelect("SUM(CASE WHEN f.status = 'rejected' THEN 1 ELSE 0 END)", 'rejected')
      .groupBy('f.competencyCode')
      .getRawMany();

    return {
      total,
      approved,
      rejected,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      byCompetency,
    };
  }
}
