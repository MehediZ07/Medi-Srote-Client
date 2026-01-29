import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock cannot be negative'),
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().optional(),
});

export type MedicineFormData = z.infer<typeof medicineSchema>;