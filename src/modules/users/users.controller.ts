import { Controller, Get, Post, Body, Inject, UsePipes } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserRequest } from "@nutriplan/types/create_user_request";
import { SchemaValidationPipe } from "@nutriplan/infrastructure/SchemaValidationPipe";
import { firstValueFrom } from "rxjs";

@Controller("users")
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService
  ) {}

  @Get("health")
  getHello() {
    return this.usersService.getHello();
  }

  @Post()
  @UsePipes(new SchemaValidationPipe("create_user_request"))
  async createUser(@Body() body: CreateUserRequest) {
    return firstValueFrom(this.usersService.createUser(body));
  }
}
