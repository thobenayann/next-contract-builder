import { z } from 'zod';

export const clauseSchema = z.object({
    title: z
        .string({
            required_error: 'Le titre est requis',
        })
        .min(1, 'Le titre est requis'),
    content: z
        .string({
            required_error: 'Le contenu est requis',
        })
        .min(1, 'Le contenu est requis'),
    category: z.string().default('default'),
});

export type ClauseFormData = z.infer<typeof clauseSchema>;
