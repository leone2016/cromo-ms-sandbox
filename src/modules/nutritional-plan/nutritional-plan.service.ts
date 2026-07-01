import { Injectable } from '@nestjs/common';

@Injectable()
export class NutritionalPlanService {
  getHello() {
    return { message: 'nutritional plan health', ms: process.env.MS_NAME || 'sandbox' };
  }
}
