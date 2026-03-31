import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../common/redis/redis.module';
import { AuthModule } from '../auth/auth.module';
import { AiService } from './ai.service';

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [TasksController],
  providers: [TasksService, AiService],
})
export class TasksModule {}


