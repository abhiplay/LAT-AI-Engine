import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './grade.entity';

@Injectable()
export class GradeService {
  constructor(@InjectRepository(Grade) private repo: Repository<Grade>) {}

  findAll() {
    return this.repo.find({ order: { number: 'ASC' } });
  }
}
