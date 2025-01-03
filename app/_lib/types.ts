import { Clause, Contract, Employee } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { ContractFormData } from './validations/schemas/contract.schema';

interface ContractWithClauses extends Contract {
    clauses: {
        clause: Clause;
        order: number;
    }[];
}

interface ContractFormInitialData {
    contract?: ContractWithClauses | null;
    clauses: Clause[];
    employees: Employee[];
}

export interface ContractFormClientProps {
    action: 'create' | 'edit' | 'view';
    initialData: ContractFormInitialData;
    employeeId?: string;
    contractId?: string;
}

export interface EmployeeWithContract extends Employee {
    contract: Contract | null;
    isOwner?: boolean;
}

export interface ValidationError {
    path: string[];
    message: string;
}

export interface CreateEmployeeError {
    validationErrors?: ValidationError[];
}

export interface ContractFormUIProps {
    form: UseFormReturn<ContractFormData>;
    isViewMode: boolean;
    isEditing: boolean;
    isSubmitting: boolean;
    onSubmit: (data: ContractFormData) => void;
    availableClauses: Clause[];
    employees: Employee[];
    contractId?: string;
}

export interface ContractFormProps {
    params: {
        action: 'create' | 'edit' | 'view';
        id?: string;
    };
    searchParams: {
        employeeId?: string;
    };
}
