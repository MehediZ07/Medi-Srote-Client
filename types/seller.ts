export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    soldCount: number;
  }>;
}

export interface SellerMedicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  category: {
    id: string;
    name: string;
  };
  isActive: boolean;
  createdAt: string;
}

export interface SellerOrder {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  orderItems: Array<{
    id: string;
    medicine: {
      id: string;
      name: string;
      image?: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}