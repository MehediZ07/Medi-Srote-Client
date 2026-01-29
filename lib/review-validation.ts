import { z } from 'zod';

export const reviewSchema = z.object({
  medicineId: z.string().min(1, 'Medicine ID is required'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;