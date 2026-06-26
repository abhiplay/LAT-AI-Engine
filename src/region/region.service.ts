import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './region.entity';

@Injectable()
export class RegionService {
  constructor(@InjectRepository(Region) private repo: Repository<Region>) {}
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  create(data: Partial<Region>) { return this.repo.save(this.repo.create(data)); }
}
