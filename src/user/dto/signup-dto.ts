import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto {
  @IsNotEmpty({ message: "Tên không được để trống." })
  name: string;

  @IsEmail({}, { message: "Email không hợp lệ." })
  email: string;

  @IsNotEmpty({ message: "Mật khẩu không được để trống." })
  password: string;
}