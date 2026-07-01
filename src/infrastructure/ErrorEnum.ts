import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  E001 = "E001",
  E002 = "E002",
  E003 = "E003",
}

export interface ErrorDetail {
  code: ErrorCode;
  message: string;
  statusCode: HttpStatus;
}

export const ERRORS: Record<ErrorCode, ErrorDetail> = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Cuerpo de la petición inválido.",
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.E002]: {
    code: ErrorCode.E002,
    message: "Ha ocurrido un error inesperado.",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  [ErrorCode.E003]: {
    code: ErrorCode.E003,
    message: "El correo electrónico ya está registrado.",
    statusCode: HttpStatus.CONFLICT,
  },
};
