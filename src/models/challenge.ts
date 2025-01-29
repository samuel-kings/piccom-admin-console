enum ChallengeType {
  ImageFromCamera = "imageFromCamera",
  ImageFromGallery = "imageFromGallery",
  VideoFromCamera = "videoFromCamera",
  VideoFromGallery = "videoFromGallery"
}

enum ContentStatus {
  Published = "published",
  Draft = "draft",
  Flagged = "flagged",
  Trash = "trash"
}

class Challenge {
  public $id: string;
  public $createdAt: string;
  public $updatedAt: string;
  public creatorId: string;
  public title: string;
  public description?: string;
  public type: ChallengeType;
  public requirements: string;
  public prize?: string;
  public maxParticipants?: number;
  public startDate: string;
  public endDate: string;
  public status: ContentStatus;
  public flagReason?: string;
  public tags: string[];
  public totalPosts: number; // local variable
  public totalSubs?: number; // local variable

  constructor(data: {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    creatorId: string;
    title: string;
    description?: string;
    type: ChallengeType;
    requirements: string;
    prize?: string;
    maxParticipants?: number;
    startDate: string;
    endDate: string;
    status: ContentStatus;
    flagReason?: string;
    tags: string[];
    totalPosts?: number;
    totalSubs?: number;
  }) {
    this.$id = data.$id;
    this.$createdAt = data.$createdAt;
    this.$updatedAt = data.$updatedAt;
    this.creatorId = data.creatorId;
    this.title = data.title;
    this.description = data.description;
    this.type = data.type;
    this.requirements = data.requirements;
    this.prize = data.prize;
    this.maxParticipants = data.maxParticipants;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.status = data.status;
    this.flagReason = data.flagReason;
    this.tags = data.tags;
    this.totalPosts = data.totalPosts || 0;
    this.totalSubs = data.totalSubs;
  }

  public toMap(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      creatorId: this.creatorId,
      title: this.title,
      type: this.type,
      requirements: this.requirements,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
      tags: this.tags
    };

    if (this.description) result.description = this.description;
    if (this.prize) result.prize = this.prize;
    if (this.maxParticipants) result.maxParticipants = this.maxParticipants;
    if (this.flagReason) result.flagReason = this.flagReason;

    return result;
  }

  public static fromMap(map: Record<string, unknown>): Challenge {
    return new Challenge({
      $id: (map["$id"] as string) || "",
      $createdAt: (map["$createdAt"] as string) || "",
      $updatedAt: (map["$updatedAt"] as string) || "",
      creatorId: (map["creatorId"] as string) || "",
      title: (map["title"] as string) || "",
      description: map["description"] as string | undefined,
      type: map["type"] as ChallengeType,
      requirements: (map["requirements"] as string) || "",
      prize: map["prize"] as string | undefined,
      maxParticipants: map["maxParticipants"] as number | undefined,
      startDate: (map["startDate"] as string) || "",
      endDate: (map["endDate"] as string) || "",
      status: map["status"] as ContentStatus,
      flagReason: map["flagReason"] as string | undefined,
      tags: Array.isArray(map["tags"]) ? map["tags"] : [],
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): Challenge {
    return Challenge.fromMap(JSON.parse(source));
  }
}

export { Challenge, ChallengeType, ContentStatus };