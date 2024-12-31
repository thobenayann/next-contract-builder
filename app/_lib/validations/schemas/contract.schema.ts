import { z } from 'zod';

// Schéma pour une clause dans le contexte d'un contrat
const contractClauseSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    category: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
});

export const contractSchema = z.object({
    type: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    employeeId: z.string(),
    selectedClauses: z.array(contractClauseSchema),
});

export type ContractFormData = z.infer<typeof contractSchema>;
