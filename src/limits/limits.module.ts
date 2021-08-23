import { Module } from '@nestjs/common';
import { LimitsService } from './limits.service';
import { LimitsController } from './limits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LimitEntity } from '@pdf-me/shared';
@Module({
  imports: [TypeOrmModule.forFeature([LimitEntity])],
  providers: [LimitsService],
  controllers: [LimitsController],
})
export class LimitsModule {}
