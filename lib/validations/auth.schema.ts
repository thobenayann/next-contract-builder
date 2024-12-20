import * as z from 'zod';

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    email: z
        .string()
        .email('Email invalide')
        .min(5, 'Email trop court')
        .max(100, 'Email trop long'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
