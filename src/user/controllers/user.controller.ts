import { Body, Controller, Post } from "@nestjs/common";
import { SignInDto } from "../dto/signin-dto";
import { SignUpDto } from "../dto/signup-dto";
import { ISignResult } from "../interfaces/signin.interface";
import { UserEntity } from "../models/user.entity";
import { UserService } from "../services/user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Post("signup")
  async signUp(@Body() user: SignUpDto): Promise<UserEntity> {
    return this.userService.signUp(user);
  }

  @Post("signin")
  async signIn(@Body() user: SignInDto): Promise<ISignResult> {
    return this.userService.signIn(user);
  }
}