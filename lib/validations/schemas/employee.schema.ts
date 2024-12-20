import { z } from 'zod';

import { GENDERS } from '@/lib/constants';

export const employeeSchema = z.object({
    firstName: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
    lastName: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
    gender: z.enum([GENDERS.MALE, GENDERS.FEMALE], {
        errorMap: () => ({ message: 'Veuillez sélectionner un genre valide' }),
    }),
    birthdate: z
        .string()
        .refine((date) => new Date(date) <= new Date(), {
            message: 'La date de naissance ne peut pas être dans le futur',
        })
        .refine(
            (date) => {
                const age =
                    new Date().getFullYear() - new Date(date).getFullYear();
                return age >= 16 && age <= 100;
            },
            { message: "L'âge doit être compris entre 16 et 100 ans" }
        ),
    nationality: z
        .string()
        .min(2, 'La nationalité doit contenir au moins 2 caractères')
        .max(50, 'La nationalité ne peut pas dépasser 50 caractères'),
    ssn: z.string().refine(
        (value) => {
            const cleaned = value.replace(/[^\d]/g, '');
            return /^[12][0-9]{14}$/.test(cleaned);
        },
        {
            message:
                'Le numéro de sécurité sociale doit être au format valide (15 chiffres commençant par 1 ou 2)',
        }
    ),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
