import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  SetAdditionalLimitDto,
  SetSubscriptionLimitDto,
} from '@eabald/pdf-me-shared';
import { LimitsService } from './limits.service';

@Controller('limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @MessagePattern({ cmd: 'limits-get-by-user' })
  async getUserLimit(@Payload() payload: number) {
    return this.limitsService.getUserLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-create' })
  async createLimit(@Payload() payload: number) {
    return this.limitsService.createLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-reduce' })
  async reduceLimit(@Payload() payload: number) {
    return this.limitsService.reduceLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-reset-user-limit' })
  async resetUserLimit(@Payload() payload: number) {
    return this.limitsService.resetUserLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-reset' })
  async resetLimits() {
    return this.limitsService.resetLimits();
  }

  @MessagePattern({ cmd: 'limits-reset-subscription' })
  async resetSubscriptionLimits() {
    return this.limitsService.resetSubscriptionLimits();
  }

  @MessagePattern({ cmd: 'limits-reset-subscription-by-id' })
  async resetSubscriptionByUser(@Payload() payload: number) {
    return this.limitsService.resetSubscriptionByUser(payload);
  }

  @MessagePattern({ cmd: 'limits-check' })
  async checkLimit(@Payload() payload: number) {
    return this.limitsService.checkLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-set-additional' })
  async setAdditionalLimit(@Payload() payload: SetAdditionalLimitDto) {
    return this.limitsService.setAdditionalLimit(payload);
  }

  @MessagePattern({ cmd: 'limits-set-subscription' })
  async setSubscriptionLimit(@Payload() payload: SetSubscriptionLimitDto) {
    return this.limitsService.setAdditionalLimit(payload);
  }
}
