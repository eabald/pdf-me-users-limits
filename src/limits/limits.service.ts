import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LimitEntity } from '@pdf-me/shared';
import { Repository } from 'typeorm';

@Injectable()
export class LimitsService {
  constructor(
    @InjectRepository(LimitEntity)
    private limitsRepository: Repository<LimitEntity>,
  ) {}

  async createLimit(userId: number) {
    const newLimit = await this.limitsRepository.create({ userId });
    await this.limitsRepository.save(newLimit);
    return newLimit;
  }

  async reduceLimit(userId: number) {
    const currentLimit = await this.limitsRepository.findOne({ userId });
    return this.limitsRepository.update(
      { userId },
      { currentLimit: currentLimit.currentLimit - 1 },
    );
  }

  async resetLimit(userId: number) {
    const currentLimit = await this.limitsRepository.findOne({ userId });
    return this.limitsRepository.update(
      { userId },
      { currentLimit: currentLimit.perHourLimit },
    );
  }

  async checkLimit(userId: number) {
    return await this.limitsRepository.findOne({ userId });
  }
}
