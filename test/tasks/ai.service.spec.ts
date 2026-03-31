import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from '../../src/tasks/ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('categorizeTask', () => {
    it('should categorize meeting related tasks', async () => {
      const result = await service.categorizeTask('Schedule a meeting with the client');
      expect(result).toBe('Meetings');
    });

    it('should categorize development tasks', async () => {
      const result = await service.categorizeTask('Implement new authentication feature');
      expect(result).toBe('Development');
    });

    it('should categorize design tasks', async () => {
      const result = await service.categorizeTask('Create UI mockups for dashboard');
      expect(result).toBe('Design');
    });

    it('should return General as default category', async () => {
      const result = await service.categorizeTask('Random task description');
      expect(result).toBe('General');
    });

    it('should handle empty description gracefully', async () => {
      const result = await service.categorizeTask('');
      expect(result).toBe('General');
    });
  });
});
