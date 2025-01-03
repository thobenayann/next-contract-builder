import { Contract, Employee } from '@prisma/client';

export interface EmployeeWithContract extends Employee {
    contract: Contract | null;
    isOwner: boolean;
}

export interface ValidationError {
    path: string[];
    message: string;
}

export interface CreateEmployeeError {
    validationErrors?: ValidationError[];
}
