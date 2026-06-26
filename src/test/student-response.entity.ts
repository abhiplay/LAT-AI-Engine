import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('student_responses')
export class StudentResponse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: number;

  @Column()
  questionId: number;

  @Column()
  questionText: string;

  @Column({ nullable: true })
  subjectName: string;

  @Column({ nullable: true })
  competencyCode: string;

  @Column('varchar', { nullable: true })
  selectedAnswer: string;

  @Column()
  correctAnswer: string;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ default: false })
  skipped: boolean;
}
