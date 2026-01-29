import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  phone: z.string().min(10, 'Phone number is required'),
  paymentMethod: z.enum(['credit_card', 'cash_on_delivery']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;