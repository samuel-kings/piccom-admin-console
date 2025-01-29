import { database } from '../appwrite';
import { Report } from '../models/report';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';

export interface ReportFilters {
  typeFilter: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy?: string;
}

export const fetchReports = async ({
  typeFilter,
  currentPage,
  itemsPerPage,
  sortBy = 'newest',
}: ReportFilters) => {
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
      AppwriteConsts.reportsCollection,
      queries
    );

    const reports = res.documents.map(doc => Report.fromMap(doc));

    return {
      reports,
      total: res.total,
    };
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};