import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectService {
  constructor(@InjectRepository(Subject) private repo: Repository<Subject>) {}

  findByGrade(gradeId: number) {
    return this.repo.find({ where: { gradeId }, order: { name: 'ASC' } });
  }
}
