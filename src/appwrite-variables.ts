class AppwriteConsts {
    // project variables
    static readonly endpoint: string = "https://auth.piccom.app/v1";
    static readonly projectId: string = "6654d9030002d3ebfed5";
    static readonly databaseId: string = "default";
    
    // collections
    static readonly profilesCollection: string = "6686c94a00390f420b13";
    static readonly interestCategoriesCollection: string = "667b151c003a8509bee7";
    static readonly postsCollection: string = "6654e5070006a2bb294a";
    static readonly challengesCollection: string = "6654e50f0034b8b8715e";
    static readonly notificationsCollection: string = "6654e64d002b08e4858a";
    static readonly reportsCollection: string = "6655d44b002a1b8013d4";
    static readonly chatsCollection: string = "6655d892000cde791353";
    static readonly commentsCollection: string = "6655d65f000330c82086";
    static readonly feedbacksCollection: string = "6695766f00050e30ff62";
    static readonly supportTicketsCollection: string = "669d9ee60028f604cd2c";
    static readonly supportChatCollection: string = "66ddf609001b41558270";

    // storage
    static readonly challengeVideosBucket: string = "6655d269002ad26ca5bf";
    static readonly challengeImagesAndThumbsBucket: string = "6655d23500237ec5a933";
    static readonly postVideosBucket: string = "6654e41d003d1a3a12b6";
    static readonly postImagesAndThumbsBucket: string = "6654e3cf0005a6829d83";
    static readonly profilePicturesBucket: string = "6654e3670002815fd4d4";
    static readonly coverPhotosBucket: string = "668bc58700214c569211";

    // functions
    static readonly likeUnlikePost: string = "66bbeb0eb8bfd9bd2aef";
    static readonly postViewsIncrement: string = "66c323253487acfc7f13";
    static readonly likeUnlikeComment: string = "66c4f5db6fb4ccea6cfc";
    static readonly onFollowUser: string = "66d9d19c000505418cdc";
    static readonly getSubsCountAndStatus: string = "66f546bf0026e360390e";
    static readonly toggleAccountStatusFunction: string = "67941866000e83e636d8";

    // messaging providers
    static readonly fcm: string = "665fb45d00209f5f117c";
    static readonly apns: string = "6776f71e001cabb0b5f0";
}

export default AppwriteConsts;