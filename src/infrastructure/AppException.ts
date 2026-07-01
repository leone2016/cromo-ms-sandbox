import { HttpException, HttpStatus } from "@nestjs/common";
const rcfile = require("rcfile");

export class AppException extends HttpException {
  public readonly code: string;
  public readonly name: string;
  public readonly metadata: any;
  private readonly _error: any;
  private readonly _message?: string;

  constructor(
    error: { code: string; message: string; statusCode: HttpStatus },
    message?: string,
    metadata?: any
  ) {
    let config: any = {};
    try {
      config = rcfile("utransfer") || {};
    } catch (e) {
      // Fallback
    }

    let prefix = "E";
    if (config.errorPrefix !== undefined) {
      prefix = config.errorPrefix;
    }

    const cleanCodeNum = error.code.replace("E", "");
    const code = `${prefix}${cleanCodeNum}`;
    const name = `UTR-${cleanCodeNum}`;
    const errorMsg = message || error.message;

    super(
      {
        code,
        message: errorMsg,
        statusCode: error.statusCode,
        name,
        metadata: metadata || {},
      },
      error.statusCode
    );

    this.code = code;
    this.name = name;
    this.metadata = metadata || {};
    this._error = error;
    this._message = message;

    Error.captureStackTrace(this, AppException);
  }

  getStatusCode(): HttpStatus {
    return this.getStatus();
  }

  getMessage(): string {
    return this._message || this._error.message;
  }

  getMetadata(): any {
    return this.metadata || {};
  }
}
