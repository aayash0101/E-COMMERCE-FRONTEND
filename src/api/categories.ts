import { api } from "@/api/axios";
import type { ApiResponse } from "@/types";

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export const categoriesApi = {
  list: async (): Promise<CategoryOption[]> => {
    const response = await api.get<ApiResponse<{ categories: CategoryOption[] }>>(
      "/categories"
    );
    return response.data.data.categories;
  },
};