import { database, functions, storage } from '../appwrite';
import { Challenge, ChallengeType } from '../models/challenge';
import AppwriteConsts from '../appwrite-variables';
import { AppwriteException, Query } from 'appwrite';
import { ID } from 'appwrite';

export interface ChallengeFilters {
  statusFilter: string;
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
}

export const getSubsCount = async (challengeId: string) => {
  const body = { topicName: `challenge_${challengeId}` };
  try {
    const res = await functions.createExecution(
      AppwriteConsts.getSubsCountAndStatus,
      JSON.stringify(body)
    );
    const responseBody = JSON.parse(res.responseBody);
    if (responseBody.success) {
      return JSON.parse(responseBody.success);
    }
    return null;
  } catch (error) {
    console.error('Error getting subs count:', error);
    return null;
  }
};

export const getChallengePostsCount = async (challengeId: string): Promise<number> => {
  try {
    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      [
        Query.equal('challengeId', challengeId),
        Query.equal('status', 'published')
      ]
    );
    return res.total;
  } catch (error) {
    console.error('Error getting posts count:', error);
    return 0;
  }
};

export const fetchChallenges = async ({ statusFilter, searchQuery, currentPage, itemsPerPage }: ChallengeFilters) => {
  try {
    const queries: string[] = [
      Query.orderDesc('endDate')
    ];
    
    if (statusFilter !== 'all') {
      queries.push(Query.equal('status', statusFilter));
    }

    if (searchQuery) {
      queries.push(Query.search('title', searchQuery));
    }

    if (currentPage > 1) {
      const offset = (currentPage - 1) * itemsPerPage;
      queries.push(Query.offset(offset));
    }
    queries.push(Query.limit(itemsPerPage));

    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      queries
    );

    const challengesList: Challenge[] = await Promise.all(
      res.documents.map(async (doc) => {
        const challenge = Challenge.fromMap(doc);
        const subsCountRes = await getSubsCount(challenge.$id);
        const postsCount = await getChallengePostsCount(challenge.$id);
        
        challenge.totalPosts = postsCount;
        challenge.totalSubs = subsCountRes?.subCount as number || 0;
        
        return challenge;
      })
    );

    return {
      challenges: challengesList,
      total: res.total
    };
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

export const updateChallenge = async (challenge: Challenge) => {
  try {
    const response = await database.updateDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      challenge.$id,
      challenge.toMap()
    );
    return Challenge.fromMap(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating challenge:', error.message);
      throw new Error(`Failed to update challenge: ${error.message}`);
    } else {
      console.error('Error updating challenge:', error);
      throw new Error('Failed to update challenge');
    }
  }
};

export const getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.src = url;

    video.addEventListener("loadedmetadata", () => {
      resolve(video.duration);
      URL.revokeObjectURL(url);
    });

    video.addEventListener("error", e => {
      reject(new Error("Error loading video: " + e.message));
      URL.revokeObjectURL(url);
    });

    video.load();
  });
};

export const uploadFile = async (
  file: File,
  isImage: boolean
): Promise<string | null> => {
  try {
    const bucketId = isImage
      ? AppwriteConsts.challengeImagesAndThumbsBucket
      : AppwriteConsts.challengeVideosBucket;

    const res = await storage.createFile(bucketId, ID.unique(), file);
    console.log(`${isImage ? "Image" : "Video"} uploaded successfully`);
    return res.$id;
  } catch (e) {
    if (e instanceof AppwriteException) {
      console.error(`Error uploading ${isImage ? "image" : "video"}: ${e.toString()}`);
      return null;
    } else {
      console.error(`Error uploading ${isImage ? "image" : "video"}: ${e}`);
      return null;
    }
  }
};

export const createChallenge = async (challenge: Challenge, file: File) => {
  try {
    const isVideo =

      challenge.type === ChallengeType.VideoFromCamera ||
      challenge.type === ChallengeType.VideoFromGallery;

    let challengeId = "";

    if (isVideo) {
      const duration = await getVideoDuration(file);

      if (duration > 60) {
        throw new Error("Video must be less than 60 seconds");
      }

      challengeId = (await uploadFile(file, false)) || "";
    } else {
      challengeId = (await uploadFile(file, true)) || "";
    }

    if (challengeId === "") {
      throw new Error("Error uploading file");
    }

    await database.createDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      challengeId,
      challenge.toMap()
    );

    return challengeId;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const deleteChallenge = async (challenge: Challenge) => {
  try {
    const isVideo = 
      challenge.type === ChallengeType.VideoFromCamera || 
      challenge.type === ChallengeType.VideoFromGallery;

    // Delete the challenge file from storage
    try {
      await storage.deleteFile(
        isVideo ? AppwriteConsts.challengeVideosBucket : AppwriteConsts.challengeImagesAndThumbsBucket,
        challenge.$id
      );
    } catch (error) {
      console.error('Error deleting challenge file:', error);
      // Continue with document deletion even if file deletion fails
    }

    // Delete the challenge document
    await database.deleteDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      challenge.$id
    );
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};