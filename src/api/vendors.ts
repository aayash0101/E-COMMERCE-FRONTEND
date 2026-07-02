import { api } from "@/api/axios";
import type { VendorProfile, ApiResponse } from "@/types";

export interface ApplyVendorFields {
  storeName: string;
  storeDescription?: string;
}

export const vendorsApi = {
  apply: async (fields: ApplyVendorFields): Promise<VendorProfile> => {
    const response = await api.post<ApiResponse<{ vendorProfile: VendorProfile }>>(
      "/vendors/apply",
      fields
    );
    return response.data.data.vendorProfile;
  },
  getProfile: async (): Promise<VendorProfile> => {
    const response = await api.get<ApiResponse<{ vendorProfile: VendorProfile }>>(
      "/vendors/profile"
    );
    return response.data.data.vendorProfile;
  },
  updateProfile: async (
    fields: Partial<ApplyVendorFields>
  ): Promise<VendorProfile> => {
    const response = await api.put<ApiResponse<{ vendorProfile: VendorProfile }>>(
      "/vendors/profile",
      fields
    );
    return response.data.data.vendorProfile;
  },
};