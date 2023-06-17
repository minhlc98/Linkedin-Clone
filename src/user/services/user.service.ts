import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { Repository } from "typeorm";
import { SignInDto } from "../dto/signin-dto";
import { SignUpDto } from "../dto/signup-dto";
import { ISignIn } from "../interfaces/signin.interface";
import { UserEntity } from "../models/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  async signUp(user: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await this.authService.hashPassword(user.password);
    const newUser = await this.userRepository.save({
      name: user.name,
      email: user.email,
      password: hashedPassword
    });

    return newUser;
  }

  async signIn(user: SignInDto): Promise<ISignIn> {
    try {
      const { email, password } = user;
      const foundUser = await this.userRepository.findOneBy({ email });
      if (!foundUser) {
        return { error: true, message: 'Email hoặc mật khẩu không hợp lệ.', user: null, token: null }
      }

      const isMatchPassword = await this.authService.comparePassword(password, foundUser.password);
      if (!isMatchPassword) {
        return { error: true, message: 'Email hoặc mật khẩu không hợp lệ.', user: null, token: null }
      }

      const token = await this.authService.signToken({ 
        id: foundUser.id,
        name: foundUser.name, 
        email: foundUser.email 
      });

      delete foundUser.password;

      return { error: false, message: null, user: foundUser, token }
    }
    catch (error) {
      console.log(error);
      return { error: true, message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.', user: null, token: null }
    }
  }
}