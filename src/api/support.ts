import { api } from "@/api/axios";
import type { ApiResponse } from "@/types";

export type SupportSenderRole = "customer" | "admin" | "system";

export interface SupportMessage {
  id: string;
  customerId: string;
  senderRole: SupportSenderRole;
  senderId?: string;
  message: string;
  readByAdmin: boolean;
  readByCustomer: boolean;
  createdAt: string;
}

export interface ConversationSummary {
  customerId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  lastSenderRole: SupportSenderRole;
  unreadByAdminCount: number;
}

export const supportApi = {
  getMyConversation: async (): Promise<SupportMessage[]> => {
    const response = await api.get<ApiResponse<{ messages: SupportMessage[] }>>(
      "/support/me"
    );
    return response.data.data.messages;
  },
  sendMyMessage: async (message: string): Promise<SupportMessage[]> => {
    const response = await api.post<ApiResponse<{ messages: SupportMessage[] }>>(
      "/support/me",
      { message }
    );
    return response.data.data.messages;
  },
  getConversations: async (): Promise<ConversationSummary[]> => {
    const response = await api.get<ApiResponse<{ conversations: ConversationSummary[] }>>(
      "/support/conversations"
    );
    return response.data.data.conversations;
  },
  getConversationById: async (customerId: string): Promise<SupportMessage[]> => {
    const response = await api.get<ApiResponse<{ messages: SupportMessage[] }>>(
      `/support/conversations/${customerId}`
    );
    return response.data.data.messages;
  },
  sendAdminMessage: async (
    customerId: string,
    message: string
  ): Promise<SupportMessage[]> => {
    const response = await api.post<ApiResponse<{ messages: SupportMessage[] }>>(
      `/support/conversations/${customerId}`,
      { message }
    );
    return response.data.data.messages;
  },
};