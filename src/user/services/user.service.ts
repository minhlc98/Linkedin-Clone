import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { Repository } from "typeorm";
import { SignInDto } from "../dto/signin-dto";
import { SignUpDto } from "../dto/signup-dto";
import { ISignResult } from "../interfaces/signin.interface";
import { UserEntity } from "../models/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  async signUp(user: SignUpDto): Promise<UserEntity> {
    try {
      const isEmailExisted = await this.checkExistEmail({ email: user.email });
      if (isEmailExisted) {
        throw new HttpException("Email đã tồn tại.", HttpStatus.BAD_REQUEST);
      }

      const hashedPassword = await this.authService.hashPassword(user.password);
      const newUser = await this.userRepository.save({
        name: user.name,
        email: user.email,
        password: hashedPassword
      });

      delete newUser.password;

      return newUser;
    }
    catch (error) {
      if (error.code === '23505') {
        throw new HttpException("Email đã tồn tại.", HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async checkExistEmail({ email }) {
    const total = await this.userRepository.count({ where: { email } });
    return total > 0;
  }

  async signIn(user: SignInDto): Promise<ISignResult> {
    try {
      const { email, password } = user;
      const foundUser = await this.userRepository.findOneBy({ email });
      if (!foundUser) {
        throw new HttpException("Email hoặc mật khẩu không hợp lệ.", HttpStatus.BAD_REQUEST)
      }

      const isMatchPassword = await this.authService.comparePassword(password, foundUser.password);
      if (!isMatchPassword) {
        throw new HttpException("Email hoặc mật khẩu không hợp lệ.", HttpStatus.BAD_REQUEST)
      }

      const token = await this.authService.signToken({ 
        id: foundUser.id,
        name: foundUser.name, 
        email: foundUser.email 
      });

      delete foundUser.password;

      return { user: foundUser, token }
    }
    catch (error) {
      throw new HttpException("Đã xảy ra lỗi. Vui lòng thử lại sau.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}