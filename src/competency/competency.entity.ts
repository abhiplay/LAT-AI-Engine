import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Subject } from '../subject/subject.entity';

@Entity('competencies')
export class Competency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Subject, (s) => s.competencies)
  subject: Subject;

  @Column()
  subjectId: number;
}
