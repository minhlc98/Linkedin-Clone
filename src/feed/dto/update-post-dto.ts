import { IsNotEmpty } from "class-validator";

export class UpdatePostDto {
  @IsNotEmpty({ message: "Nội dung không được để trống." })
  content: string;
}