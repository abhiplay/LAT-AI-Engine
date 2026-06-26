import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionModule } from './question/question.module';
import { GradeModule } from './grade/grade.module';
import { SubjectModule } from './subject/subject.module';
import { CompetencyModule } from './competency/competency.module';
import { SeederModule } from './seeder/seeder.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RegionModule } from './region/region.module';
import { SchoolModule } from './school/school.module';
import { TestModule } from './test/test.module';
import { RoleModule } from './role/role.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +(config.get<number>('DB_PORT') ?? 3306),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    RoleModule,
    RegionModule,
    SchoolModule,
    QuestionModule,
    GradeModule,
    SubjectModule,
    CompetencyModule,
    TestModule,
    SeederModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
