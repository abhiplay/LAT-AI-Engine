import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private roleService: RoleService,
  ) {}

  private async generateRollId(schoolId: number, gradeId: number): Promise<string> {
    const gradePrefix = gradeId === 1 ? 'C3' : gradeId === 2 ? 'C6' : 'C9';
    const count = await this.repo.count({ where: { schoolId, gradeId } });
    const seq = String(count + 1).padStart(4, '0');
    return `SCH${String(schoolId).padStart(3, '0')}-${gradePrefix}-${seq}`;
  }

  async create(data: {
    name: string; email?: string; password: string; roleName: string;
    regionId?: number; schoolId?: number; gradeId?: number; gradeName?: string;
  }) {
    if (data.email) {
      const exists = await this.repo.findOne({ where: { email: data.email } });
      if (exists) throw new ConflictException('Email already exists');
    }

    const role = await this.roleService.findByName(data.roleName);
    if (!role) throw new NotFoundException(`Role "${data.roleName}" not found`);

    const hashed = await bcrypt.hash(data.password, 10);
    let rollId: string | undefined;
    if (data.roleName === 'student' && data.schoolId && data.gradeId) {
      rollId = await this.generateRollId(data.schoolId, data.gradeId);
    }

    const { roleName, ...rest } = data;
    return this.repo.save(this.repo.create({ ...rest, password: hashed, roleId: role.id, rollId }));
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: ['role'] });
  }

  async findByRollId(rollId: string) {
    return this.repo.findOne({ where: { rollId }, relations: ['role'] });
  }

  findAll() {
    return this.repo.find({ relations: ['role'], order: { createdAt: 'DESC' } });
  }

  findBySchool(schoolId: number) {
    return this.repo.find({ where: { schoolId }, relations: ['role'], order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const user = await this.repo.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async validatePassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
