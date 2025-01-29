import AppwriteConsts from "./appwrite-variables";

class UrlHelper {
  /**For other generic files */
    private static getFileURL(bucketId: string, fileId: string) {
      return `${AppwriteConsts.endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${AppwriteConsts.projectId}`;
    }
  
    static getProfileImageURL(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.profilePicturesBucket, fileId);
    }
  
    static getCoverPhotoURL(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.coverPhotosBucket, fileId);
    }
  
    static getPostImageUrl(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.postImagesAndThumbsBucket, fileId);
    }
  
    static getPostVideoUrl(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.postVideosBucket, fileId);
    }
  
    static getChallengeImageUrl(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.challengeImagesAndThumbsBucket, fileId);
    }
  
    static getChallengeVideoUrl(fileId: string) {
      return UrlHelper.getFileURL(AppwriteConsts.challengeVideosBucket, fileId);
    }
}

export default UrlHelper;