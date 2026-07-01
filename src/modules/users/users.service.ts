import { Injectable, Inject } from '@nestjs/common';
import { DynamoGateway } from '../../infrastructure/database/DynamoGateway';

@Injectable()
export class UsersService {
  constructor(@Inject(DynamoGateway) private readonly dynamoGateway: DynamoGateway) {}

  getHello() {
    return { message: 'users health', ms: process.env.MS_NAME || 'sandbox' };
  }
}
