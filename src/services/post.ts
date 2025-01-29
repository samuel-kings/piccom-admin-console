import { database, storage } from '../appwrite';
import { Post, PostType } from '../models/post';
import AppwriteConsts from '../appwrite-variables';
import { Query, ID, AppwriteException } from 'appwrite';

export interface PostFilters {
  statusFilter: string;
  searchQuery?: string;
  currentPage: number;
  itemsPerPage: number;
}

export const fetchPosts = async ({
  statusFilter,
  searchQuery,
  currentPage,
  itemsPerPage,
}: PostFilters) => {
  try {
    const queries: string[] = [Query.orderDesc('$createdAt')];

    if (statusFilter !== 'all') {
      queries.push(Query.equal('status', statusFilter));
    }

    if (searchQuery) {
      queries.push(Query.search('caption', searchQuery));
    }

    if (currentPage > 1) {
      const offset = (currentPage - 1) * itemsPerPage;
      queries.push(Query.offset(offset));
    }
    queries.push(Query.limit(itemsPerPage));

    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      queries
    );

    const posts = res.documents.map(doc => Post.fromMap(doc));

    return {
      posts,
      total: res.total,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const updatePost = async (post: Post) => {
  try {
    const response = await database.updateDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      post.$id,
      post.toMap()
    );
    return Post.fromMap(response);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error updating post:', error.message);
      throw new Error(`Failed to update post: ${error.message}`);
    } else {
      console.error('Error updating post:', error);
      throw new Error('Failed to update post');
    }
  }
};

export const createPost = async (post: Post, file: File) => {
  try {
    const isVideo = post.type === PostType.Video;

    if (isVideo) {
      const duration = await _getVideoDuration(file);

      if (duration > 60) {
        throw new Error('Video must be less than 60 seconds');
      }
    }

    // Upload the file
    const fileId = await _uploadFile(file, !isVideo);
    if (!fileId) {
      throw new Error('Error uploading file');
    }

    console.log('File uploaded successfully');

    // Create the post document with the same ID as the file
    await database.createDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      fileId,
      post.toMap()
    );

    console.log('Post created successfully');
    return true;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

const _getVideoDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;

    video.addEventListener('loadedmetadata', () => {
      resolve(video.duration);
      URL.revokeObjectURL(url);
    });

    video.addEventListener('error', (e) => {
      reject(new Error('Error loading video: ' + e.message));
      URL.revokeObjectURL(url);
    });

    video.load();
  });
};

const _uploadFile = async (file: File, isImage: boolean): Promise<string | null> => {
  try {
    const bucketId = isImage
      ? AppwriteConsts.postImagesAndThumbsBucket
      : AppwriteConsts.postVideosBucket;

    const resourceId = ID.unique();
    console.log(`Uploading ${isImage ? 'image' : 'video'} to storage`);

    const res = await storage.createFile(bucketId, resourceId, file);
    console.log(`${isImage ? 'Image' : 'Video'} uploaded successfully`);
    return res.$id;
  } catch (error) {
    if (error instanceof AppwriteException) {
      console.error(`Error uploading ${isImage ? 'image' : 'video'}: ${error.message}`);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
    console.error(`Error uploading ${isImage ? 'image' : 'video'}: ${error}`);
    throw new Error('Failed to upload file');
  }
};

export const deletePost = async (post: Post) => {
  try {
    const isVideo = post.type === PostType.Video;

    // Delete the post file from storage
    try {
      await storage.deleteFile(
        isVideo
          ? AppwriteConsts.postVideosBucket
          : AppwriteConsts.postImagesAndThumbsBucket,
        post.$id
      );
    } catch (error) {
      console.error('Error deleting post file:', error);
      // Continue with document deletion even if file deletion fails
    }

    // Delete the post document
    await database.deleteDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      post.$id
    );
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};