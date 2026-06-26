import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  @Roles('admin')
  findAll() { return this.service.findAll(); }

  @Get('school/:schoolId')
  @Roles('admin', 'coordinator')
  findBySchool(@Param('schoolId') schoolId: string) {
    return this.service.findBySchool(+schoolId);
  }

  @Post()
  @Roles('admin')
  create(@Body() body: {
    name: string; email: string; password: string; roleName: string;
    regionId?: number; schoolId?: number; gradeId?: number; gradeName?: string;
  }) {
    return this.service.create(body);
  }

  @Post('add-student')
  @Roles('admin', 'coordinator')
  addStudent(
    @Body() body: { name: string; email?: string; password: string; gradeId: number; gradeName: string },
    @CurrentUser() user: any,
  ) {
    return this.service.create({
      name: body.name, email: body.email, password: body.password,
      roleName: 'student',
      regionId: user.regionId, schoolId: user.schoolId,
      gradeId: body.gradeId, gradeName: body.gradeName,
    });
  }

  @Post('bulk-students')
  @Roles('admin', 'coordinator')
  async bulkStudents(
    @Body() body: { students: { name: string; email?: string; password: string; gradeId: number; gradeName: string }[] },
    @CurrentUser() user: any,
  ) {
    const results = await Promise.allSettled(
      body.students.map(s => this.service.create({
        name: s.name, email: s.email, password: s.password,
        roleName: 'student',
        regionId: user.regionId, schoolId: user.schoolId,
        gradeId: s.gradeId, gradeName: s.gradeName,
      }))
    );
    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    return { success, failed, total: body.students.length };
  }
}
