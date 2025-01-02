import { Prisma } from '@prisma/client';
import { UseFormReturn } from 'react-hook-form';
import { ContractFormData } from './validations';

// Types Prisma
export type ContractWithRelations = Prisma.ContractGetPayload<{
    include: {
        clauses: {
            include: {
                clause: true;
            };
        };
        employee: true;
    };
}>;

export type EmployeeWithContract = Prisma.EmployeeGetPayload<{
    include: {
        contract: true;
    };
}>;

// Types pour les formulaires et composants
type BaseParams = {
    action: 'create' | 'edit' | 'view';
};

type ActionParams = BaseParams & {
    action: 'edit' | 'view';
    id: string;
};

type CreateParams = BaseParams & {
    action: 'create';
};

export type ContractFormProps = {
    params: ActionParams | CreateParams;
    searchParams: {
        employeeId?: string;
    };
};

export interface ContractFormClientProps {
    action: string;
    initialData: {
        clauses: Prisma.ClauseGetPayload<{}>[];
        employees: Prisma.EmployeeGetPayload<{}>[];
        contract: ContractWithRelations | null;
    };
    employeeId?: string;
    contractId?: string;
}

export interface ContractFormUIProps {
    form: UseFormReturn<ContractFormData>;
    isViewMode: boolean;
    isEditing: boolean;
    isSubmitting: boolean;
    onSubmit: (data: ContractFormData) => Promise<void>;
    availableClauses: Prisma.ClauseGetPayload<{}>[];
    employees: Prisma.EmployeeGetPayload<{}>[];
    contractId?: string;
}
