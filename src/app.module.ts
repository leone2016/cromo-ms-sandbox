import { Module } from "@nestjs/common";
import { UsersModule } from "./modules/users/users.module";
import { PatientsModule } from "./modules/patients/patients.module";
import { NutritionalPlanModule } from "./modules/nutritional-plan/nutritional-plan.module";
import { EvaluationModule } from "./modules/evaluation/evaluation.module";
import { DatabaseModule } from "./infrastructure/database/database.module";

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    PatientsModule,
    NutritionalPlanModule,
    EvaluationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
