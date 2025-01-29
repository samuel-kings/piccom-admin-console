export enum TicketStatus {
  Open = "open",
  Closed = "closed",
  OnHold = "onHold",
}

export class SupportTicket {
  public $id: string;
  public $createdAt: string;
  public $updatedAt: string;
  public customerId: string;
  public title: string;
  public lastMessage: string;
  public status: TicketStatus;
  public isNew: boolean;

  constructor(data: {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    customerId: string;
    title: string;
    lastMessage: string;
    status?: TicketStatus;
    isNew?: boolean;
  }) {
    this.$id = data.$id;
    this.$createdAt = data.$createdAt;
    this.$updatedAt = data.$updatedAt;
    this.customerId = data.customerId;
    this.title = data.title;
    this.lastMessage = data.lastMessage;
    this.status = data.status ?? TicketStatus.Open;
    this.isNew = data.isNew ?? true;
  }

  public toMap(): Record<string, unknown> {
    return {
      customerId: this.customerId,
      title: this.title,
      lastMessage: this.lastMessage,
      status: this.status,
      isNew: this.isNew,
    };
  }

  public static fromMap(map: Record<string, unknown>): SupportTicket {
    return new SupportTicket({
      $id: (map["$id"] as string) || "",
      $createdAt: (map["$createdAt"] as string) || "",
      $updatedAt: (map["$updatedAt"] as string) || "",
      customerId: (map["customerId"] as string) || "",
      title: (map["title"] as string) || "",
      lastMessage: (map["lastMessage"] as string) || "",
      status: (map["status"] as TicketStatus) || TicketStatus.Open,
      isNew: (map["isNew"] as boolean) ?? true,
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): SupportTicket {
    return SupportTicket.fromMap(JSON.parse(source));
  }
}

export class SupportMessage {
  public $id: string;
  public $createdAt: string;
  public $updatedAt: string;
  public senderId: string;
  public ticketId: string;
  public message: string;
  public isImageAttached: boolean;
  public isRead: boolean;
  public isCustomer: boolean;

  constructor(data: {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    senderId: string;
    ticketId: string;
    message: string;
    isImageAttached?: boolean;
    isRead?: boolean;
    isCustomer: boolean;
  }) {
    this.$id = data.$id;
    this.$createdAt = data.$createdAt;
    this.$updatedAt = data.$updatedAt;
    this.senderId = data.senderId;
    this.ticketId = data.ticketId;
    this.message = data.message;
    this.isImageAttached = data.isImageAttached ?? false;
    this.isRead = data.isRead ?? false;
    this.isCustomer = data.isCustomer;
  }

  public toMap(includeId = false): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    if (includeId) {
      result["$id"] = this.$id;
      result["$createdAt"] = this.$createdAt;
      result["$updatedAt"] = this.$updatedAt;
    }
    result["senderId"] = this.senderId;
    result["ticketId"] = this.ticketId;
    result["message"] = this.message;
    result["isImageAttached"] = this.isImageAttached;
    result["isRead"] = this.isRead;
    result["isCustomer"] = this.isCustomer;
    return result;
  }

  public static fromMap(map: Record<string, unknown>): SupportMessage {
    return new SupportMessage({
      $id: (map["$id"] as string) || "",
      $createdAt: (map["$createdAt"] as string) || "",
      $updatedAt: (map["$updatedAt"] as string) || "",
      senderId: (map["senderId"] as string) || "",
      ticketId: (map["ticketId"] as string) || "",
      message: (map["message"] as string) || "",
      isImageAttached: (map["isImageAttached"] as boolean) || false,
      isRead: (map["isRead"] as boolean) || false,
      isCustomer: (map["isCustomer"] as boolean) || false,
    });
  }

  public toJson(): string {
    return JSON.stringify(this.toMap());
  }

  public static fromJson(source: string): SupportMessage {
    return SupportMessage.fromMap(JSON.parse(source));
  }
}