import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LimitsService } from './limits.service';

@Controller('limits')
export class LimitsController {
  constructor(private readonly limitsService: LimitsService) {}

  @MessagePattern({ cmd: 'limits-create' })
  async createLimit(@Payload() userId: number) {
    return this.limitsService.createLimit(userId);
  }

  @MessagePattern({ cmd: 'limits-reduce' })
  async reduceLimit(@Payload() userId: number) {
    return this.limitsService.reduceLimit(userId);
  }

  @MessagePattern({ cmd: 'limits-reset' })
  async resetLimit(@Payload() userId: number) {
    return this.limitsService.resetLimit(userId);
  }
}
