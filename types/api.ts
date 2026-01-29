export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  averageRating?: number;
  createdAt: string;
  seller: {
    id: string;
    name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
    description?: string;
  };
  _count?: {
    reviews: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface MedicinesResponse {
  success: boolean;
  message: string;
  data: Medicine[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}