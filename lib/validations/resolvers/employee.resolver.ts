import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '../schemas/employee.schema';

export const employeeResolver = zodResolver(employeeSchema);
