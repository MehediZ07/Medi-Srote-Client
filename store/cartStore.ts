import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  clear: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.medicineId === item.medicineId);
        if (existingItem) {
          return {
            items: state.items.map(i =>
              i.medicineId === item.medicineId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      
      removeItem: (medicineId) => set((state) => ({
        items: state.items.filter(item => item.medicineId !== medicineId)
      })),
      
      updateQuantity: (medicineId, quantity) => set((state) => ({
        items: state.items.map(item =>
          item.medicineId === medicineId
            ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) }
            : item
        ).filter(item => item.quantity > 0)
      })),
      
      clear: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);