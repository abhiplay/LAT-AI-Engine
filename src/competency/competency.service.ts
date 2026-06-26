import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Competency } from './competency.entity';

@Injectable()
export class CompetencyService {
  constructor(@InjectRepository(Competency) private repo: Repository<Competency>) {}

  findBySubject(subjectId: number) {
    return this.repo.find({ where: { subjectId }, order: { code: 'ASC' } });
  }
}
