import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from "@nestjs/config";
import { config } from 'dotenv';
config();

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2 days' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}