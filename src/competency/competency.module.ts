import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Competency } from './competency.entity';
import { CompetencyController } from './competency.controller';
import { CompetencyService } from './competency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Competency])],
  controllers: [CompetencyController],
  providers: [CompetencyService],
  exports: [CompetencyService],
})
export class CompetencyModule {}
