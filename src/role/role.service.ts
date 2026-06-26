import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private repo: Repository<Role>) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }
}
