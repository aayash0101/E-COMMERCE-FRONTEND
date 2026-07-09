export type UserRole = 'customer' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  storeDescription?: string;
  logoUrl?: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: Category;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: 'active' | 'inactive' | 'flagged';
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  productId: {
    id: string;
    name: string;
    images: string[];
  };
  vendorId: string;
  name: string;
  price: number;
  quantity: number;
  itemStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

// Generic API response wrapper matching our backend shape
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}