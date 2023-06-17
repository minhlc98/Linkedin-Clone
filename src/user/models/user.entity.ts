import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { FeedPostEntity } from "src/feed/models/post.entity";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @OneToMany(() => FeedPostEntity, (post) => post.user)
  posts: FeedPostEntity[];
}