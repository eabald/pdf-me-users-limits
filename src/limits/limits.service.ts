import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LimitEntity } from '@pdf-me/shared';
import { SetAdditionalLimitDto, SetSubscriptionLimitDto } from '@pdf-me/shared';
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
      'UPDATE public.limit SET "current_limit" = "per_hour_limit" WHERE id = ? WHERE "current_limit" < "per_hour_limit"',
      [userId],
    );
  }

  async resetLimits() {
    return await this.limitsRepository.query(
      'UPDATE public.limit SET "current_limit" = "per_hour_limit" WHERE "current_limit" < "per_hour_limit"',
    );
  }

  async checkLimit(userId: number) {
    const limit = await this.limitsRepository.findOne({ userId });
    return limit.currentLimit + limit.extraLimit;
  }

  async setSubscriptionLimit({
    userId,
    limit,
    limitPerHour,
    extraValidTo,
  }: SetSubscriptionLimitDto) {
    return this.limitsRepository.query(
      'UPDATE public.limit SET "limit" = "limit" + ?, "per_hour_limit: = ? extra_valid_to = ? WHERE userId = ?',
      [limit, limitPerHour, extraValidTo, userId],
    );
  }

  async setAdditionalLimit({
    userId,
    limit,
    extraValidTo,
  }: SetAdditionalLimitDto) {
    return this.limitsRepository.query(
      'UPDATE public.limit SET "extra_limit" = "extra_limit" + ?, extra_valid_to = ? WHERE userId = ?',
      [limit, extraValidTo, userId],
    );
  }

  async resetAdditionalLimits() {
    return this.limitsRepository.query(
      'UPDATE public.limit SET "extra_limit" = 0 WHERE "extraValidTo" < now();',
    );
  }

  async resetSubscriptionLimits() {
    return this.limitsRepository.query(
      'UPDATE public.limit SET "extra_limit" = CASE WHEN "extra_limit" < 5 THEN 5 ELSE "extra_limit" END, "per_hour_limit" = 5, "extra_valid_to" = null WHERE "extra_valid_to" < now( ) ;',
    );
  }

  async resetSubscriptionByUser(userId: number) {
    return this.limitsRepository.query(
      'UPDATE public.limit SET "extra_limit" = CASE WHEN "extra_limit" < 5 THEN 5 ELSE "extra_limit" END, "per_hour_limit" = 5, "extra_valid_to" = null WHERE "user_id" = ? ;',
      [userId],
    );
  }
}
