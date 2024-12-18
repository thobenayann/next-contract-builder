import { zodResolver } from '@hookform/resolvers/zod';
import { contractSchema } from '../schemas/contract.schema';

export const contractResolver = zodResolver(contractSchema);
