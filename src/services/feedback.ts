import { database } from '../appwrite';
import { Feedback } from '../models/feedback';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';

export interface FeedbackFilters {
  typeFilter: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy?: string;
}

export const fetchFeedback = async ({
  typeFilter,
  currentPage,
  itemsPerPage,
  sortBy = 'newest',
}: FeedbackFilters) => {
  try {
    const queries: string[] = [];
    
    // Add sorting
    switch (sortBy) {
      case 'oldest':
        queries.push(Query.orderAsc('$createdAt'));
        break;
      case 'type':
        queries.push(Query.orderAsc('type'), Query.orderDesc('$createdAt'));
        break;
      case 'rating':
        queries.push(Query.orderDesc('rating'), Query.orderDesc('$createdAt'));
        break;
      case 'newest':
      default:
        queries.push(Query.orderDesc('$createdAt'));
        break;
    }

    if (typeFilter !== 'all') {
      queries.push(Query.equal('type', typeFilter));
    }

    if (currentPage > 1) {
      const offset = (currentPage - 1) * itemsPerPage;
      queries.push(Query.offset(offset));
    }
    queries.push(Query.limit(itemsPerPage));

    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.feedbacksCollection,
      queries
    );

    const feedback = res.documents.map(doc => Feedback.fromMap(doc));

    return {
      feedback,
      total: res.total,
    };
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw error;
  }
};