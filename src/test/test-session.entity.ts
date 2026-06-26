import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('test_sessions')
export class TestSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  studentName: string;

  @Column()
  gradeId: number;

  @Column()
  gradeName: string;

  @Column({ nullable: true })
  schoolId: number;

  @Column({ nullable: true })
  regionId: number;

  @Column()
  totalQuestions: number;

  @Column({ default: 0 })
  score: number;

  @Column({ default: 0 })
  attempted: number;

  @Column({ nullable: true })
  timeTakenSeconds: number;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}
