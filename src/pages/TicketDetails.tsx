import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { SupportTicket, SupportMessage, TicketStatus } from '../models/support';
import { database } from '../appwrite';
import { sendMessage } from '../services/support';
import AppwriteConsts from '../appwrite-variables';
import { Query } from 'appwrite';
import UserAvatar from '../components/UserAvatar';
import { getProfile } from '../services/profile';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/Button';

const TicketDetails: React.FC = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<{ name: string; pfpId?: string } | null>(null);

  useEffect(() => {
    const loadTicketAndMessages = async () => {
      try {
        // Mark ticket as not new when opened
        if (ticketId) {
          await database.updateDocument(
            AppwriteConsts.databaseId,
            AppwriteConsts.supportTicketsCollection,
            ticketId,
            { isNew: false }
          );
        }

        // Fetch ticket details
        const ticketDoc = await database.getDocument(
          AppwriteConsts.databaseId,
          AppwriteConsts.supportTicketsCollection,
          ticketId!
        );
        const ticket = SupportTicket.fromMap(ticketDoc);
        setTicket(ticket);

        // Fetch customer details
        const customer = await getProfile(ticket.customerId);
        setCustomerDetails({
          name: customer.name,
          pfpId: customer.pfpId
        });

        // Fetch messages
        const messagesRes = await database.listDocuments(
          AppwriteConsts.databaseId,
          AppwriteConsts.supportChatCollection,
          [
            Query.equal('ticketId', ticketId!),
            Query.orderAsc('$createdAt')
          ]
        );
        setMessages(messagesRes.documents.map(doc => SupportMessage.fromMap(doc)));
      } catch (error) {
        console.error('Error loading ticket details:', error);
        showToast('Failed to load ticket details', 'error');
        navigate('/support');
      } finally {
        setIsLoading(false);
      }
    };

    if (ticketId) {
      loadTicketAndMessages();
    }
  }, [ticketId, navigate, showToast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticket) return;

    try {
      setIsSending(true);
      const newSupportMessage = await sendMessage(ticket.$id, newMessage);
      setMessages(prev => [...prev, newSupportMessage]);
      setNewMessage('');
      showToast('Message sent successfully', 'success');
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const updateTicketStatus = async (status: TicketStatus) => {
    if (!ticket) return;

    try {
      await database.updateDocument(
        AppwriteConsts.databaseId,
        AppwriteConsts.supportTicketsCollection,
        ticket.$id,
        { status }
      );

      setTicket(prev => prev ? new SupportTicket({
        ...prev,
        status
      }) : null);

      showToast('Ticket status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating ticket status:', error);
      showToast('Failed to update ticket status', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-98px)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FD989D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!ticket || !customerDetails) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/support')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{ticket.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Opened on {new Date(ticket.$createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <select
            value={ticket.status}
            onChange={(e) => updateTicketStatus(e.target.value as TicketStatus)}
            className="px-3 py-1.5 bg-white text-gray-900 dark:bg-dark-surface dark:text-white border border-gray-300 dark:border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors"
          >
            <option value={TicketStatus.Open}>Open</option>
            <option value={TicketStatus.OnHold}>On Hold</option>
            <option value={TicketStatus.Closed}>Closed</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-lg shadow-sm p-6 dark:border dark:border-dark-border mb-6">
        <div className="flex items-center gap-3 mb-6">
          <UserAvatar
            userId={ticket.customerId}
            name={customerDetails.name}
            pfpId={customerDetails.pfpId}
            size={48}
          />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {customerDetails.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
          </div>
        </div>

        <div className="space-y-6 mb-6">
          {messages.map((message) => (
            <div
              key={message.$id}
              className={`flex gap-4 ${message.isCustomer ? '' : 'flex-row-reverse'}`}
            >
              {message.isCustomer ? (
                <UserAvatar
                  userId={ticket.customerId}
                  name={customerDetails.name}
                  pfpId={customerDetails.pfpId}
                  size={40}
                />
              ) : (
                <UserAvatar
                  userId={message.senderId}
                  name="Piccom Admin"
                  pfpId={message.senderId}
                  size={40}
                />
              )}
              <div
                className={`flex-1 max-w-[80%] ${
                  message.isCustomer ? 'mr-12' : 'ml-12'
                }`}
              >
                <div
                  className={`rounded-lg p-4 ${
                    message.isCustomer
                      ? 'bg-gray-100 dark:bg-dark-border'
                      : 'bg-[#FD989D] bg-opacity-10'
                  }`}
                >
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(message.$createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {ticket.status === TicketStatus.Open && (
          <div className="flex gap-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[100px] px-4 py-3 border border-gray-300 bg-white text-gray-900 dark:border-dark-border dark:bg-dark-surface dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FD989D] focus:border-transparent transition-colors resize-none"
            />
            <Button
              text={isSending ? 'Sending...' : 'Send'}
              onClick={handleSendMessage}
              disabled={isSending || !newMessage.trim()}
              className="h-fit"
            >
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
        {ticket.status !== TicketStatus.Open && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-border/50 rounded-lg">
            This ticket is {ticket.status === TicketStatus.Closed ? 'closed' : 'on hold'}. You cannot send new messages.
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;