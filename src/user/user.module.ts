import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UserController } from "./controllers/user.controller";
import { UserEntity } from "./models/user.entity";
import { UserService } from "./services/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]), 
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}