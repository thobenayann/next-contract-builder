import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { employeeSchema } from './schemas/employee.schema';

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const employeeResolver = zodResolver(employeeSchema);
