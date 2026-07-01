import { Module, Global } from '@nestjs/common';
import { DynamoGateway } from './DynamoGateway';

@Global()
@Module({
  providers: [DynamoGateway],
  exports: [DynamoGateway],
})
export class DatabaseModule {}
