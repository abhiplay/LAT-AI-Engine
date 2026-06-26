import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from './school.entity';

@Injectable()
export class SchoolService {
  constructor(@InjectRepository(School) private repo: Repository<School>) {}
  findAll() { return this.repo.find(); }
  findByRegion(regionId: number) { return this.repo.find({ where: { regionId } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(data: Partial<School>) { return this.repo.save(this.repo.create(data)); }
}
