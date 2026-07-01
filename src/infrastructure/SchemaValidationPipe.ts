import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
const Ajv = require('ajv-draft-04');
import { SCHEMAS } from '../schema';
import { ERRORS, ErrorCode } from './ErrorEnum';
import { AppException } from './AppException';

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
  private ajv: any;

  constructor(private schemaName: string) {
    this.ajv = new Ajv({ allErrors: true });
    
    // Load the target schema
    const schema = SCHEMAS[this.schemaName];
    if (schema) {
      this.ajv.addSchema(schema, this.schemaName);
    }
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    
    const validate = this.ajv.getSchema(this.schemaName);
    if (!validate) {
      throw new BadRequestException(`Schema ${this.schemaName} not found`);
    }

    const valid = validate(value);
    if (!valid) {
      throw new AppException(
        ERRORS[ErrorCode.E001],
        undefined,
        validate.errors
      );
    }

    return value;
  }
}
