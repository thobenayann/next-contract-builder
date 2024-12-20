import { zodResolver } from '@hookform/resolvers/zod';

import { contractSchema } from '../schemas/contract.schema';

export const contractResolver = zodResolver(contractSchema, {
    errorMap: (error, ctx) => {
        console.log('Validation error:', error, ctx);
        return { message: error.message || 'Erreur de validation' };
    },
});
