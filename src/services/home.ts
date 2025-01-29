import { database } from '../appwrite';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';

export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalChallenges: number;
  newChallenges: number;
  activeChallenges: number;
  totalPosts: number;
  newPosts: number;
  newReports: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const queries = {
    totalUsers: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection
    ),
    newUsers: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.profilesCollection,
      [Query.greaterThanEqual("$createdAt", sevenDaysAgo.toISOString())]
    ),
    challenges: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection
    ),
    newChallenges: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      [Query.greaterThanEqual("$createdAt", startOfDay.toISOString())]
    ),
    activeChallenges: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.challengesCollection,
      [Query.greaterThan("endDate", new Date().toISOString())]
    ),
    posts: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection
    ),
    newPosts: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.postsCollection,
      [Query.greaterThanEqual("$createdAt", startOfDay.toISOString())]
    ),
    newReports: database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.reportsCollection,
      [Query.greaterThanEqual("$createdAt", startOfDay.toISOString())]
    ),
  };

  try {
    const [
      totalUsersRes,
      newUsersRes,
      challengesRes,
      newChallengesRes,
      activeChallengesRes,
      postsRes,
      newPostsRes,
      newReportsRes,
    ] = await Promise.all([
      queries.totalUsers,
      queries.newUsers,
      queries.challenges,
      queries.newChallenges,
      queries.activeChallenges,
      queries.posts,
      queries.newPosts,
      queries.newReports,
    ]);

    return {
      totalUsers: totalUsersRes.total,
      newUsers: newUsersRes.total,
      totalChallenges: challengesRes.total,
      newChallenges: newChallengesRes.total,
      activeChallenges: activeChallengesRes.total,
      totalPosts: postsRes.total,
      newPosts: newPostsRes.total,
      newReports: newReportsRes.total,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};