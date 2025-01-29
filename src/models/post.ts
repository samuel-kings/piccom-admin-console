import { ContentStatus } from "./challenge";

export enum PostType {
  Image = "image",
  Video = "video",
}

export class Post {
  public $id: string;
  public $createdAt: string;
  public $updatedAt: string;
  public userId: string;
  public countryCode: string;
  public challengeId?: string;
  public type: PostType;
  public likes: string[];
  public caption?: string;
  public views: number;
  public status: ContentStatus;
  public flagReason?: string;
  public tags: string[];
  public comments: number;

  constructor(data: {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    userId: string;
    countryCode: string;
    challengeId?: string;
    type: PostType;
    likes: string[];
    caption?: string;
    views: number;
    status?: ContentStatus;
    flagReason?: string;
    tags: string[];
    comments?: number;
  }) {
    this.$id = data.$id;
    this.$createdAt = data.$createdAt;
    this.$updatedAt = data.$updatedAt;
    this.userId = data.userId;
    this.countryCode = data.countryCode;
    this.challengeId = data.challengeId;
    this.type = data.type;
    this.likes = data.likes;
    this.caption = data.caption;
    this.views = data.views;
    this.status = data.status || ContentStatus.Published;
    this.flagReason = data.flagReason;
    this.tags = data.tags;
    this.comments = data.comments || 0;
  }

  public toMap(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      userId: this.userId,
      countryCode: this.countryCode,
      type: this.type,
      likes: this.likes,
      views: this.views,
      status: this.status,
      tags: this.tags,
      comments: this.comments,
    };
    if (this.challengeId) result.challengeId = this.challengeId;
    if (this.caption) result.caption = this.caption;
    if (this.flagReason) result.flagReason = this.flagReason;
    return result;
  }

  public static fromMap(map: Record<string, unknown>): Post {
    return new Post({
      $id: (map["$id"] as string) || "",
      $createdAt: (map["$createdAt"] as string) || "",
      $updatedAt: (map["$updatedAt"] as string) || "",
      userId: (map["userId"] as string) || "",
      countryCode: (map["countryCode"] as string) || "",
      challengeId: map["challengeId"] as string | undefined,
      type: map["type"] as PostType,
      likes: (map["likes"] as string[]) || [],
      caption: map["caption"] as string | undefined,
      views: (map["views"] as number) || 0,
      status: (map["status"] as ContentStatus) || ContentStatus.Published,
      flagReason: map["flagReason"] as string | undefined,
      tags: (map["tags"] as string[]) || [],
      comments: (map["comments"] as number) || 0,
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): Post {
    return Post.fromMap(JSON.parse(source));
  }
}
