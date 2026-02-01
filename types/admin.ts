export interface AdminDashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSellers: number;
  newUsersToday: number;
  ordersToday: number;
  revenueToday: number;
  recentOrders: Array<{
    id: string;
    address: string;
    fullName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  childOrders?: Array<{
    id: string;
    status: string;
    totalAmount: number;
    seller: {
      id: string;
      name: string;
      email: string;
    };
    orderItems: Array<{
      id: string;
      medicine: {
        id: string;
        name: string;
        price: number;
      };
      quantity: number;
      price: number;
    }>;
  }>;
  orderItems?: Array<{
    id: string;
    medicine: {
      id: string;
      name: string;
      price: number;
      seller?: {
        id: string;
        name: string;
        email: string;
      };
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  totalProducts: number;
  totalSales: number;
  createdAt: string;
  _count: {
    medicines: number;
    orders: number;
  };
}