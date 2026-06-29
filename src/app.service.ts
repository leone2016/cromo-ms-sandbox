import { Injectable } from '@nestjs/common';
import { InitRequest } from '../types/init_request';

@Injectable()
export class AppService {
  compute(body: InitRequest) {
    const { n1, n2 } = body;
    return {
      n1,
      n2,
      result: n1 - n2,
      test: 'HOLA MUNDO',
    };
  }
}
