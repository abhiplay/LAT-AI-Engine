import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  regionId: number;
}
