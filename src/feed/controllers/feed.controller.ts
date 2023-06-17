import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { FeedPost } from "../models/post.interface";
import { FeedService } from "../services/feed.service";
import { Request } from "express";
import { AuthGuard } from "src/auth/auth.guard";
import { CreatePostDto } from "../dto/create-post-dto";
import { UpdatePostDto } from "../dto/update-post-dto";

@Controller("feed")
export class FeedController {
  constructor(private feedSerivce: FeedService) {}

  @Post("")
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() post: CreatePostDto) : Promise<FeedPost> {
    const user = req['user'];
    return this.feedSerivce.createPost(post, user);
  }

  @Get("")
  @UseGuards(AuthGuard)
  getPost(@Req() req: Request, @Query() query: { page: number, limit: number }): any {
    const user = req['user'];
    return this.feedSerivce.getPosts({ user, page: query.page, limit: query.limit });
  }

  @Put(":id")
  @UseGuards(AuthGuard)
  async updatePost(@Req() req: Request, @Param("id") id: number, @Body() feedPost: UpdatePostDto): Promise<FeedPost> {
    const user = req['user'];
    const found_post = await this.feedSerivce.getPost({ id, user });
    if (!found_post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    }
    const result = await this.feedSerivce.updatePost({ user, post: found_post, content: feedPost.content });
    return result;
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deletePost(@Req() req: Request, @Param("id") id: number) {
    const user = req['user'];
    const found_post = await this.feedSerivce.getPost({ id, user });
    if (!found_post) {
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    }
    const result = await this.feedSerivce.deletePost({ post: found_post, user });
    return result;
  }
}