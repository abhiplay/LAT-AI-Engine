import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TestService } from './test.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(private service: TestService) {}

  @Post('start')
  @Roles('student')
  start(@CurrentUser() user: any) {
    return this.service.startTest({
      id: user.id, name: user.name,
      gradeId: user.gradeId, gradeName: user.gradeName,
      schoolId: user.schoolId, regionId: user.regionId,
    });
  }

  @Post('submit/:sessionId')
  @Roles('student')
  submit(
    @Param('sessionId') sessionId: string,
    @Body() body: { responses: { questionId: number; selectedAnswer: string }[]; timeTakenSeconds: number },
    @CurrentUser() user: any,
  ) {
    return this.service.submitTest(+sessionId, user.id, body.responses, body.timeTakenSeconds);
  }

  @Get('my-results')
  @Roles('student')
  myResults(@CurrentUser() user: any) {
    return this.service.getMyResults(user.id);
  }

  @Get('session/:sessionId')
  @Roles('student')
  sessionDetail(@Param('sessionId') sessionId: string, @CurrentUser() user: any) {
    return this.service.getSessionDetail(+sessionId, user.id);
  }

  @Get('reports')
  @Roles('admin', 'coordinator')
  reports(
    @Query('regionId') regionId?: string,
    @Query('schoolId') schoolId?: string,
    @Query('gradeId') gradeId?: string,
    @CurrentUser() user?: any,
  ) {
    const filters: any = {};
    if (user.role === 'coordinator') filters.schoolId = user.schoolId;
    else {
      if (regionId) filters.regionId = +regionId;
      if (schoolId) filters.schoolId = +schoolId;
    }
    if (gradeId) filters.gradeId = +gradeId;
    return this.service.getReports(filters);
  }
}
