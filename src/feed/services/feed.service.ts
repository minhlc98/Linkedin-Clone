import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePostDto } from "../dto/create-post-dto";
import { FeedPostEntity } from "../models/post.entity";
import { FeedPost } from "../models/post.interface";

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedPostEntity)
    private readonly feedPostRepository: Repository<FeedPostEntity>
  ) {}

  async createPost(post: CreatePostDto, user: Object): Promise<FeedPost> {
    try {
      const newPost = await this.feedPostRepository.save({ ...post, user });
      return newPost;
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPosts({ user, page = 1, limit = 20 }) : Promise<FeedPost[]> {
    try {
      const skip = (page * limit) - limit;
      return this.feedPostRepository.find(
        { 
          where: {
            user: {
              id: user.id
            }
          },
          skip, 
          take: limit 
        }
      );
    } 
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getPost({ user, id }) {
    return this.feedPostRepository.findOneBy({ id, user: { id: user.id } });
  }

  async updatePost({ post, content, user }) {
    try {
      await this.feedPostRepository.update(
        { id: post.id, user: { id: user.id } }, 
        { content, updatedAt: new Date() }
      );
      return this.getPost({ user, id: post.id });
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deletePost({ post, user }) {
    return this.feedPostRepository.delete({ id: post.id, user: { id: user.id } });
  }
}