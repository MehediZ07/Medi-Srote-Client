export interface OrderItem {
  id: string;
  medicineId: string;
  medicine: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  price: number;
}

export interface SellerOrder {
  id: string;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  seller: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Order {
  id: string;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  orderItems?: OrderItem[];
  childOrders?: SellerOrder[];
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}