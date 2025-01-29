import { database, functions } from '../appwrite';
import { Profile } from '../models/profile';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';

export interface ProfileFilters {
  searchQuery?: string;
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
}

export const fetchProfiles = async ({ searchQuery, statusFilter, currentPage, itemsPerPage }: ProfileFilters) => {
  try {
    const queries: any[] = [
      Query.orderDesc('$createdAt')
    ];

    if (statusFilter === 'active') {
      queries.push(Query.equal('status', true));
    } else if (statusFilter === 'suspended') {
      queries.push(Query.equal('status', false));
    }

    if (searchQuery) {
      queries.push(
        Query.or([
          Query.search('username', searchQuery),
          Query.contains('username', searchQuery),
          Query.search('name', searchQuery),
          Query.contains('name', searchQuery)
        ])
      );
    }

    const offset = (currentPage - 1) * itemsPerPage;
    queries.push(Query.offset(offset));
    queries.push(Query.limit(itemsPerPage));
    
    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection,
      queries
    );

    // Fetch followers count for each profile
    const profilesWithFollowers = await Promise.all(
      res.documents.map(async (doc) => {
        const followersRes = await database.listDocuments(
          AppwriteConsts.databaseId,
          AppwriteConsts.profilesCollection,
          [Query.contains('following', doc.$id)]
        );
        const profile = Profile.fromMap(doc);
        profile.totalFollowers = followersRes.total;
        return profile;
      })
    );

    return {
      profiles: profilesWithFollowers,
      total: res.total
    };
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
};

export const getProfile = async (userId: string): Promise<Profile> => {
  try {
    const res = await database.getDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection,
      userId
    );
    return Profile.fromMap(res);
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export const getFollowersCount = async (userId: string): Promise<number> => {
  try {
    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection,
      [Query.contains('following', userId)]
    );
    return res.total;
  } catch (error) {
    console.error('Error getting followers count:', error);
    throw error;
  }
};

export const toggleVerification = async (profile: Profile): Promise<void> => {
  try {
    profile.toggleVerifcationStatus();
    await database.updateDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection,
      profile.$id,
      profile.toMap()
    );
  } catch (error) {
    console.error('Error toggling verification:', error);
    throw error;
  }
};

export const toggleAccountStatus = async (profile: Profile): Promise<boolean> => {
  try {
    const body = { userId: profile.$id };
    const res = await functions.createExecution(
      AppwriteConsts.toggleAccountStatusFunction,
      JSON.stringify(body)
    );

    if (res.status === 'completed') {
      const data = JSON.parse(res.responseBody);
      return data.status;
    }
    throw new Error('Function execution failed');
  } catch (error) {
    console.error('Error toggling account status:', error);
    throw error;
  }
};