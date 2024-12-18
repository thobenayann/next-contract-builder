import { z } from 'zod';
import { DOCUMENT_TYPES } from '@/lib/constants';

export const contractSchema = z.object({
    type: z.enum([DOCUMENT_TYPES.CONTRACT, DOCUMENT_TYPES.AMENDMENT] as const, {
        required_error: 'Le type de document est requis',
        invalid_type_error: 'Veuillez sélectionner un type de document valide',
    }),
    startDate: z
        .string({
            required_error: 'La date de début est requise',
        })
        .min(1, 'La date de début est requise'),
    endDate: z.string().optional(),
    employeeId: z
        .string({
            required_error: 'Veuillez sélectionner un employé',
        })
        .min(1, 'Veuillez sélectionner un employé'),
    selectedClauses: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            category: z.string(),
            order: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
        })
    ),
});

export type ContractFormData = z.infer<typeof contractSchema>;
