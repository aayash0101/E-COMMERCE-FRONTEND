import { api } from "@/api/axios";
import type { Product, ApiResponse, PaginationMeta } from "@/types";

export type ProductSortBy = "price" | "-price" | "-createdAt" | "-averageRating";

export interface ProductListParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: ProductSortBy;
}

export interface ProductListResult {
  data: Product[];
  meta: PaginationMeta;
}

export interface ProductFormFields {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
}

export interface ProductUpdateFields {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  status?: "active" | "inactive";
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
  getMine: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<{ products: Product[] }>>(
      "/products/vendor/mine"
    );
    return response.data.data.products;
  },
  create: async (fields: ProductFormFields, images: File[]): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", fields.name);
    formData.append("description", fields.description);
    formData.append("price", String(fields.price));
    formData.append("stock", String(fields.stock));
    formData.append("categoryId", fields.categoryId);
    images.forEach((file) => formData.append("images", file));

    const response = await api.post<ApiResponse<{ product: Product }>>(
      "/products",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data.product;
  },
  update: async (id: string, fields: ProductUpdateFields): Promise<Product> => {
    const response = await api.put<ApiResponse<{ product: Product }>>(
      `/products/${id}`,
      fields
    );
    return response.data.data.product;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};