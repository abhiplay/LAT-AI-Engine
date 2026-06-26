import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum QuestionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gradeId: number;

  @Column()
  gradeName: string;

  @Column()
  subjectId: number;

  @Column()
  subjectName: string;

  @Column()
  competencyId: number;

  @Column()
  competencyCode: string;

  @Column('text')
  competencyDescription: string;

  @Column('text')
  questionText: string;

  @Column('json')
  options: { key: string; value: string }[];

  @Column()
  correctAnswer: string;

  @Column('text', { nullable: true })
  explanation: string;

  @Column({ nullable: true })
  questionType: string;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column('text', { nullable: true })
  imagePrompt: string;

  @Column('text', { nullable: true })
  imageDescription: string;

  @Column('json', { nullable: true })
  patternData: { shape: string; color: string; size: string }[];

  @Column('json', { nullable: true })
  chartData: { title: string; yLabel: string; bars: { label: string; value: number }[] };

  @Column('json', { nullable: true })
  clockData: { hours: number; minutes: number; label?: string };

  @Column('json', { nullable: true })
  scaleData: object;

  @Column()
  llmUsed: string;

  @Column({ type: 'enum', enum: QuestionStatus, default: QuestionStatus.PENDING })
  status: QuestionStatus;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @CreateDateColumn()
  createdAt: Date;
}
