import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LimitsService } from './limits.service';

@Controller('limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

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

  @MessagePattern({ cmd: 'limits-check' })
  async checkLimit(@Payload() payload: number) {
    return this.limitsService.checkLimit(payload);
  }
}
