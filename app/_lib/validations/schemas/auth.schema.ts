import { z } from 'zod';

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    email: z.string().email('Email invalide'),
    password: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    organization: z.object({
        name: z
            .string()
            .min(
                2,
                "Le nom de l'organisation doit contenir au moins 2 caractères"
            )
            .max(
                50,
                "Le nom de l'organisation ne peut pas dépasser 50 caractères"
            ),
    }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
    email: z
        .string()
        .email('Email invalide')
        .min(5, 'Email trop court')
        .max(100, 'Email trop long'),
    password: z
        .string()
        .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
        .max(50, 'Le mot de passe ne peut pas dépasser 50 caractères'),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
            .max(32, 'Le mot de passe ne doit pas dépasser 32 caractères'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
