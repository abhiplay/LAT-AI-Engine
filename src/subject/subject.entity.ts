import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { Competency } from '../competency/competency.entity';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Grade, (grade) => grade.subjects)
  grade: Grade;

  @Column()
  gradeId: number;

  @OneToMany(() => Competency, (c) => c.subject)
  competencies: Competency[];
}
