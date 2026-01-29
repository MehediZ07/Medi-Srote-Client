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
    customerName: string;
    sellerName: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  sellerName: string;
  orderItems: Array<{
    medicine: { name: string };
    quantity: number;
  }>;
  totalAmount: number;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
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