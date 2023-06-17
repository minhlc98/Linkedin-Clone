import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: "Email không hơp lệ." })
  email: string;

  @IsNotEmpty({ message: "Mật khẩu không được để trống." })
  password: string;
}