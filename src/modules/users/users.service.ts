import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getHello() {
    return { message: 'users health', ms: process.env.MS_NAME || 'sandbox' };
  }
}
