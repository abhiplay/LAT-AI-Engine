import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('question_feedback')
export class QuestionFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  questionId: number;

  @Column()
  competencyCode: string;

  @Column()
  gradeName: string;

  @Column()
  subjectName: string;

  @Column({ nullable: true })
  questionType: string;

  @Column('text')
  questionText: string;

  @Column('json')
  options: { key: string; value: string }[];

  @Column()
  correctAnswer: string;

  @Column('text', { nullable: true })
  explanation: string;

  @Column()
  status: string;

  @Column('text', { nullable: true })
  rejectionReason: string;

  @Column()
  pineconeId: string;

  @Column()
  llmUsed: string;

  @CreateDateColumn()
  createdAt: Date;
}
