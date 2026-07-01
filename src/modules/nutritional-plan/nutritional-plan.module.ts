import { Module } from '@nestjs/common';
import { NutritionalPlanController } from './nutritional-plan.controller';
import { NutritionalPlanService } from './nutritional-plan.service';

@Module({
  controllers: [NutritionalPlanController],
  providers: [NutritionalPlanService],
  exports: [NutritionalPlanService],
})
export class NutritionalPlanModule {}
