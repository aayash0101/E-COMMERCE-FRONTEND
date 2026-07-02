import { api } from "@/api/axios";
import type { Product, ApiResponse, PaginationMeta } from "@/types";

export interface ProductListParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
}

export interface ProductListResult {
  data: Product[];
  meta: PaginationMeta;
}

export const productsApi = {
  list: async (params: ProductListParams = {}): Promise<ProductListResult> => {
    const response = await api.get<ApiResponse<ProductListResult>>("/products", {
      params,
    });
    return response.data.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<{ product: Product }>>(
      `/products/${id}`
    );
    return response.data.data.product;
  },
};