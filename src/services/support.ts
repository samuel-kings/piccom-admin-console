import { ID } from 'appwrite';
import { database } from '../appwrite';
import { SupportTicket, SupportMessage, TicketStatus } from '../models/support';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';

export interface TicketFilters {
  statusFilter: string;
  currentPage: number;
  itemsPerPage: number;
  sortBy?: string;
}

export const fetchTickets = async ({
  statusFilter,
  currentPage,
  itemsPerPage,
  sortBy = 'newest',
}: TicketFilters) => {
  try {
    const queries: string[] = [];
    
    // Add sorting
    switch (sortBy) {
      case 'oldest':
        queries.push(Query.orderAsc('$createdAt'));
        break;
      case 'status':
        queries.push(Query.orderAsc('status'), Query.orderDesc('$createdAt'));
        break;
      case 'newest':
      default:
        queries.push(Query.orderDesc('$createdAt'));
        break;
    }

    if (statusFilter !== 'all') {
      queries.push(Query.equal('status', statusFilter));
    }

    if (currentPage > 1) {
      const offset = (currentPage - 1) * itemsPerPage;
      queries.push(Query.offset(offset));
    }
    queries.push(Query.limit(itemsPerPage));

    const res = await database.listDocuments(
      AppwriteConsts.databaseId,
      AppwriteConsts.supportTicketsCollection,
      queries
    );

    const tickets = res.documents.map(doc => SupportTicket.fromMap(doc));

    return {
      tickets,
      total: res.total,
    };
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

export const sendMessage = async (ticketId: string, message: string) => {
  try {
    const supportMessage = new SupportMessage({
      $id: ID.unique(),
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      senderId: '6686dc3f4e295c96caf4', // Admin ID
      ticketId,
      message,
      isCustomer: false,
      isRead: true,
    });

    // Create message document
    const response = await database.createDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.supportChatCollection,
      ID.unique(),
      supportMessage.toMap(false)
    );

    // Update ticket's last message
    await database.updateDocument(
      AppwriteConsts.databaseId,
      AppwriteConsts.supportTicketsCollection,
      ticketId,
      {
        lastMessage: message,
        status: "open",
        isNew: false
      }
    );

    return SupportMessage.fromMap(response);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};