import { Controller, Post, Body, UsePipes, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { InitRequest } from '../types/init_request';
import { SchemaValidationPipe } from './infrastructure/SchemaValidationPipe';

@Controller('health')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Post()
  @UsePipes(new SchemaValidationPipe('init_request'))
  compute(@Body() body: InitRequest) {
    return this.appService.compute(body);
  }
}
