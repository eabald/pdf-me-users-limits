import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LimitEntity } from '@pdf-me/shared';
import { SetAdditionalLimitDto } from '@pdf-me/shared';
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
    const update =
      currentLimit.currentLimit === 0
        ? { extraLimit: currentLimit.extraLimit - 1 }
        : { currentLimit: currentLimit.currentLimit - 1 };
    return this.limitsRepository.update({ userId }, update);
  }

  async resetUserLimit(userId: number) {
    return await this.limitsRepository.query(
      'UPDATE public.limits SET "currentLimit" = "perHourLimit" WHERE id = ? WHERE "currentLimit" < "perHourLimit"',
      [userId],
    );
  }

  async resetLimits() {
    return await this.limitsRepository.query(
      'UPDATE public.limits SET "currentLimit" = "perHourLimit" WHERE "currentLimit" < "perHourLimit"',
    );
  }

  async checkLimit(userId: number) {
    const limit = await this.limitsRepository.findOne({ userId });
    return limit.currentLimit + limit.extraLimit;
  }

  async setAdditionalLimit({
    userId,
    limit,
    extraValidTo,
  }: SetAdditionalLimitDto) {
    return this.limitsRepository.query(
      'UPDATE public.limits SET "extraLimit" = "extraLimit" + ?, extraValidTo = ? WHERE userId = ?',
      [userId, extraValidTo, limit],
    );
  }

  async resetAdditionalLimits() {
    return this.limitsRepository.query(
      'UPDATE public.limits SET "extraLimit" = 0 WHERE "extraValidTo" < now();',
    );
  }
}
