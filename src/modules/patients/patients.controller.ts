import { Controller, Get, Inject } from "@nestjs/common";
import { PatientsService } from "./patients.service";

@Controller("patients")
export class PatientsController {
  constructor(
    @Inject(PatientsService) private readonly patientsService: PatientsService
  ) {}

  @Get("health")
  getHello() {
    return this.patientsService.getHello();
  }
}
