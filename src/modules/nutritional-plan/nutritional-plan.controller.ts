import { Controller, Get, Inject } from '@nestjs/common';
import { NutritionalPlanService } from './nutritional-plan.service';

@Controller('nutritional-plan')
export class NutritionalPlanController {
  constructor(@Inject(NutritionalPlanService) private readonly nutritionalPlanService: NutritionalPlanService) {}

  @Get('health')
  getHello() {
    return this.nutritionalPlanService.getHello();
  }
}
