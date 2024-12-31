import { z } from 'zod';

export const contractSchema = z.object({
    type: z.string(),
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    employeeId: z.string(),
    selectedClauses: z.array(
        z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            category: z.string(),
            order: z.number(),
            createdAt: z.string(),
            updatedAt: z.string(),
            userId: z.string(),
        })
    ),
});

export type ContractFormData = z.infer<typeof contractSchema>;
