export enum ReportType {
  Challenge = "challenge",
  Post = "post",
  PostComment = "postComment",
  User = "user",
}

export class Report {
  public userId: string;
  public resourceId: string;
  public type: ReportType;
  public title: string;
  public message: string;

  constructor(data: {
    userId: string;
    resourceId: string;
    type: ReportType;
    title: string;
    message: string;
  }) {
    this.userId = data.userId;
    this.resourceId = data.resourceId;
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
  }

  public toMap(): Record<string, unknown> {
    return {
      userId: this.userId,
      resourceId: this.resourceId,
      type: this.type,
      title: this.title,
      message: this.message,
    };
  }

  public static fromMap(map: Record<string, unknown>): Report {
    return new Report({
      userId: (map["userId"] as string) || "",
      resourceId: (map["resourceId"] as string) || "",
      type: (map["type"] as ReportType) || ReportType.Challenge,
      title: (map["title"] as string) || "",
      message: (map["message"] as string) || "",
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): Report {
    return Report.fromMap(JSON.parse(source));
  }
}