import { z } from 'zod';

export const SignupSchema = z.object({
     name: z.string().min(3).startsWith('s'),
     email: z.string().email(),
     password: z.string().min(6),
});