import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../common/redis/redis.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AiService } from './ai.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TasksService {
  private readonly CACHE_TTL: number;

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private aiService: AiService,
    private configService: ConfigService,
  ) {
    this.CACHE_TTL = this.configService.get<number>('REDIS_TTL', 3600);
  }

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    // Categorizar con IA
    const aiCategory = await this.aiService.categorizeTask(task.description || task.title);
    if (aiCategory) {
      await this.prisma.task.update({
        where: { id: task.id },
        data: { aiCategory },
      });
      task.aiCategory = aiCategory;
    }

    // Invalidar caché
    await this.clearUserCache(userId);

    return task;
  }

  async findAll(userId: string) {
    const cacheKey = `tasks:user:${userId}:all`;

    // Intentar desde Redis
    const cached = await this.redis.getClient().get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Consulta a PostgreSQL
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    // Guardar en caché
    await this.redis
      .getClient()
      .set(cacheKey, JSON.stringify(tasks), { EX: this.CACHE_TTL });

    return tasks;
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    await this.findOne(id, userId); // Verify existence and ownership

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      },
      include: { user: { select: { id: true, email: true, name: true } } },
    });

    await this.clearUserCache(userId);

    return task;
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.task.delete({ where: { id } });
    await this.clearUserCache(userId);

    return { message: 'Task deleted successfully' };
  }

  private async clearUserCache(userId: string) {
    const cacheKey = `tasks:user:${userId}:all`;
    await this.redis.getClient().del(cacheKey);
  }
}
