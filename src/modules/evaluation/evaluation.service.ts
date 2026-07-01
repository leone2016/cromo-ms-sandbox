import { Injectable } from "@nestjs/common";

@Injectable()
export class EvaluationService {
  getHello() {
    return {
      message: "evaluation health",
      ms: process.env.MS_NAME || "sandbox",
    };
  }
}
