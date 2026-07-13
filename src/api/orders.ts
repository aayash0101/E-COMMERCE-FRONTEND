import { api } from "@/api/axios";
import type { Order, ShippingAddress, ApiResponse } from "@/types";

export type PaymentMethod = "cash_on_delivery" | "esewa" | "khalti";

export interface PlaceOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface EsewaFormFields {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface EsewaInitiateResult {
  paymentUrl: string;
  fields: EsewaFormFields;
}

export interface KhaltiInitiateResult {
  pidx: string;
  paymentUrl: string;
}

export const ordersApi = {
  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(
      "/orders",
      payload
    );
    return response.data.data.order;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<{ orders: Order[] }>>(
      "/orders"
    );
    return response.data.data.orders;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<{ order: Order }>>(
      `/orders/${id}`
    );
    return response.data.data.order;
  },

  cancelOrder: async (orderId: string, reason: string): Promise<Order> => {
    const response = await api.put<ApiResponse<{ order: Order }>>(
      `/orders/${orderId}/cancel`,
      { reason }
    );
    return response.data.data.order;
  },

  // ─── eSewa ──────────────────────────────────────────────────────────
  initiateEsewaPayment: async (
    orderId: string
  ): Promise<EsewaInitiateResult> => {
    const response = await api.post<ApiResponse<EsewaInitiateResult>>(
      `/orders/${orderId}/esewa/initiate`
    );
    return response.data.data;
  },

  verifyEsewaPayment: async (data: string): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(
      "/orders/esewa/verify",
      { data }
    );
    return response.data.data.order;
  },

  // ─── Khalti ─────────────────────────────────────────────────────────
  initiateKhaltiPayment: async (
    orderId: string
  ): Promise<KhaltiInitiateResult> => {
    const response = await api.post<ApiResponse<KhaltiInitiateResult>>(
      `/orders/${orderId}/khalti/initiate`
    );
    return response.data.data;
  },

  verifyKhaltiPayment: async (pidx: string): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>(
      "/orders/khalti/verify",
      { pidx }
    );
    return response.data.data.order;
  },

  // ─── Vendor & shared ────────────────────────────────────────────────
  getVendorOrders: async (): Promise<Order[]> => {
    const response = await api.get<ApiResponse<{ orders: Order[] }>>(
      "/orders/vendor/mine"
    );
    return response.data.data.orders;
  },

  updateItemStatus: async (
    orderId: string,
    itemId: string,
    status: "shipped" | "delivered" | "cancelled"
  ): Promise<Order> => {
    const response = await api.put<ApiResponse<{ order: Order }>>(
      `/orders/${orderId}/items/${itemId}`,
      { status }
    );
    return response.data.data.order;
  },
};