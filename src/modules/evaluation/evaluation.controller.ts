import { Controller, Get, Inject } from "@nestjs/common";
import { EvaluationService } from "./evaluation.service";

@Controller("evaluation")
export class EvaluationController {
  constructor(
    @Inject(EvaluationService)
    private readonly evaluationService: EvaluationService
  ) {}

  @Get("health")
  getHello() {
    return this.evaluationService.getHello();
  }
}
