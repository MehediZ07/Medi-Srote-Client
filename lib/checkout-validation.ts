import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  phone: z.string().min(1, 'Phone number is required'),
  paymentMethod: z.enum(['credit_card', 'cash_on_delivery']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;