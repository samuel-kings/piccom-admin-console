export enum FeedbackType {
  Feedback = "feedback",
  DeactivationReason = "deactivationReason",
}

export class Feedback {
  public $id?: string;
  public $createdAt?: string;
  public $updatedAt?: string;
  public userId?: string;
  public message: string;
  public type: FeedbackType;
  public rating?: number;

  constructor(data: {
    $id?: string;
    $createdAt?: string;
    $updatedAt?: string;
    userId?: string;
    message: string;
    type: FeedbackType;
    rating?: number;
  }) {
    this.$id = data.$id;
    this.$createdAt = data.$createdAt;
    this.$updatedAt = data.$updatedAt;
    this.userId = data.userId;
    this.message = data.message;
    this.type = data.type;
    this.rating = data.rating;
  }

  public toMap(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      message: this.message,
      type: this.type,
    };
    if (this.userId) result.userId = this.userId;
    if (this.rating !== undefined) result.rating = this.rating;
    return result;
  }


  public static fromMap(map: Record<string, unknown>): Feedback {
    return new Feedback({
      $id: map["$id"] as string,
      $createdAt: map["$createdAt"] as string,
      $updatedAt: map["$updatedAt"] as string,
      userId: map["userId"] as string,
      message: (map["message"] as string) || "",
      type: map["type"] as FeedbackType,
      rating: map["rating"] as number,
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): Feedback {
    return Feedback.fromMap(JSON.parse(source));
  }
}