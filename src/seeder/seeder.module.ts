import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Grade } from '../grade/grade.entity';
import { Subject } from '../subject/subject.entity';
import { Competency } from '../competency/competency.entity';
import { Region } from '../region/region.entity';
import { School } from '../school/school.entity';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, Subject, Competency, Region, School, User, Role])],
  providers: [SeederService],
})
export class SeederModule {}
