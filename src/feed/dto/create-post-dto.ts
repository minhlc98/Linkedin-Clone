import { IsNotEmpty } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty({ message: "Nội dung không được để trống." })
  content: string;
}