import { Injectable } from "@nestjs/common";

@Injectable()
export class PatientsService {
  getHello() {
    return { message: "patients health", ms: process.env.MS_NAME || "sandbox" };
  }
}
