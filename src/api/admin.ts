import { api } from "@/api/axios";
import type { ApiResponse, User, Product, Order, VendorProfile } from "@/types";
export interface AdminStats {
    totalUsers: number;
    totalVendors: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
}

export interface RevenueByMonth {
    _id: { year: number; month: number };
    revenue: number;
    orderCount: number;
}

export type AdminProduct = Omit<Product, "vendorId" | "categoryId"> & {
    vendorId: { id: string; storeName: string } | string;
    categoryId: { id: string; name: string } | string;
};

export type AdminOrder = Omit<Order, "customerId"> & {
    customerId: { id: string; name: string; email: string } | string;
};

export const adminApi = {
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get<ApiResponse<{ stats: AdminStats }>>(
            "/admin/stats"
        );
        return response.data.data.stats;
    },
    getRevenueByMonth: async (): Promise<RevenueByMonth[]> => {
        const response = await api.get<ApiResponse<{ revenue: RevenueByMonth[] }>>(
            "/admin/revenue"
        );
        return response.data.data.revenue;
    },
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<ApiResponse<{ users: User[] }>>(
            "/admin/users"
        );
        return response.data.data.users;
    },
    deactivateUser: async (userId: string): Promise<User> => {
        const response = await api.put<ApiResponse<{ user: User }>>(
            `/admin/users/${userId}/deactivate`
        );
        return response.data.data.user;
    },
    activateUser: async (userId: string): Promise<User> => {
        const response = await api.put<ApiResponse<{ user: User }>>(
            `/admin/users/${userId}/activate`
        );
        return response.data.data.user;
    },
    getAllProducts: async (): Promise<AdminProduct[]> => {
        const response = await api.get<ApiResponse<{ products: AdminProduct[] }>>(
            "/admin/products"
        );
        return response.data.data.products;
    },
    flagProduct: async (productId: string): Promise<AdminProduct> => {
        const response = await api.put<ApiResponse<{ product: AdminProduct }>>(
            `/admin/products/${productId}/flag`
        );
        return response.data.data.product;
    },
    unflagProduct: async (productId: string): Promise<AdminProduct> => {
        const response = await api.put<ApiResponse<{ product: AdminProduct }>>(
            `/admin/products/${productId}/unflag`
        );
        return response.data.data.product;
    },
    deleteProduct: async (productId: string): Promise<void> => {
        await api.delete(`/admin/products/${productId}`);
    },
    getAllOrders: async (): Promise<AdminOrder[]> => {
        const response = await api.get<ApiResponse<{ orders: AdminOrder[] }>>(
            "/admin/orders"
        );
        return response.data.data.orders;
    },
    getPendingVendors: async (): Promise<VendorProfile[]> => {
        const response = await api.get<ApiResponse<{ vendors: VendorProfile[] }>>(
            "/admin/vendors/pending"
        );
        return response.data.data.vendors;
    },
};