import { api } from "@/api/axios";
import type { ApiResponse, Review } from "@/types";

export interface CreateReviewPayload {
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}

export const reviewsApi = {
  getProductReviews: async (productId: string): Promise<Review[]> => {
    const response = await api.get<ApiResponse<{ reviews: Review[] }>>(
      `/reviews/product/${productId}`
    );
    return response.data.data.reviews;
  },
  create: async (payload: CreateReviewPayload): Promise<Review> => {
    const response = await api.post<ApiResponse<{ review: Review }>>(
      "/reviews",
      payload
    );
    return response.data.data.review;
  },
  update: async (id: string, payload: UpdateReviewPayload): Promise<Review> => {
    const response = await api.put<ApiResponse<{ review: Review }>>(
      `/reviews/${id}`,
      payload
    );
    return response.data.data.review;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};