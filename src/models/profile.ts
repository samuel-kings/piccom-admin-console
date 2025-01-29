export class Profile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email: string;
  username: string;
  about?: string;
  birthday?: string;
  registration: string;
  status: boolean;
  tos: boolean;
  isVerified: boolean;
  referredBy?: string;
  newsletter: boolean;
  emailNotifications: boolean;
  nextBillingDate?: string;
  following: string[];
  interests: string[];
  postBookmarks: string[];
  readNotificationIds: string[];
  totalFollowers: number;
  pfpId?: string;
  bannerImageId?: string;

  constructor(
    $id: string,
    $createdAt: string,
    $updatedAt: string,
    name: string,
    email: string,
    username: string,
    registration: string,
    status: boolean,
    tos: boolean,
    isVerified: boolean,
    newsletter: boolean,
    emailNotifications: boolean,
    following: string[],
    interests: string[],
    postBookmarks: string[],
    readNotificationIds: string[],
    totalFollowers: number,
    pfpId?: string,
    bannerImageId?: string,
    about?: string,
    birthday?: string,
    referredBy?: string,
    nextBillingDate?: string
  ) {
    this.$id = $id;
    this.$createdAt = $createdAt;
    this.$updatedAt = $updatedAt;
    this.name = name;
    this.email = email;
    this.username = username;
    this.registration = registration;
    this.status = status;
    this.tos = tos;
    this.isVerified = isVerified;
    this.newsletter = newsletter;
    this.emailNotifications = emailNotifications;
    this.following = following;
    this.interests = interests;
    this.postBookmarks = postBookmarks;
    this.readNotificationIds = readNotificationIds;
    this.totalFollowers = totalFollowers;
    this.pfpId = pfpId;
    this.bannerImageId = bannerImageId;
    this.about = about;
    this.birthday = birthday;
    this.referredBy = referredBy;
    this.nextBillingDate = nextBillingDate;
  }

  toMap(): { [key: string]: unknown } {
    return {
      name: this.name,
      email: this.email,
      username: this.username,
      registration: this.registration,
      status: this.status,
      tos: this.tos,
      isVerified: this.isVerified,
      newsletter: this.newsletter,
      emailNotifications: this.emailNotifications,
      following: this.following,
      interests: this.interests,
      postBookmarks: this.postBookmarks,
      readNotificationIds: this.readNotificationIds,
      pfpId: this.pfpId,
      bannerImageId: this.bannerImageId,
      about: this.about,
      birthday: this.birthday,
      referredBy: this.referredBy,
      nextBillingDate: this.nextBillingDate
    };
  }

  static fromMap(map: { [key: string]: unknown }): Profile {
    return new Profile(
      map.$id as string,
      map.$createdAt as string,
      map.$updatedAt as string,
      map.name as string,
      map.email as string,
      map.username as string,
      map.registration as string,
      map.status as boolean,
      map.tos as boolean,
      map.isVerified as boolean,
      map.newsletter as boolean,
      map.emailNotifications as boolean,
      map.following as string[],
      map.interests as string[],
      map.postBookmarks as string[],
      map.readNotificationIds as string[],
      map.totalFollowers as number,
      map.pfpId as string,
      map.bannerImageId as string,
      map.about as string,
      map.birthday as string,
      map.referredBy as string,
      map.nextBillingDate as string
    );
  }
  
  toggleVerifcationStatus(): void {
    this.isVerified = !this.isVerified;
  }
}