import type { Clause, Contract, Employee } from '@prisma/client';

// Types étendus pour les relations
export interface ClauseWithRelations extends Clause {
    contracts?: ContractWithRelations[];
}

export interface ContractWithRelations extends Contract {
    employee: {
        firstName: string;
        lastName: string;
    };
    clauses: {
        clause: Clause;
        order: number;
    }[];
}

export interface EmployeeWithContract extends Employee {
    contract: Contract | null;
}

// Types pour les formulaires
export interface ContractFormClause {
    id: string;
    title: string;
    content: string;
    category: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface ContractFormData {
    type: string;
    startDate: string;
    endDate?: string;
    employeeId: string;
    selectedClauses: ContractFormClause[];
}

// Types pour les composants
export interface DraggableClause {
    id: string;
    title: string;
    content: string;
    category: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface DraggableClauseItem {
    id: string;
    title: string;
    content: string;
    category: string;
    order: number;
    createdAt: string | Date;
    updatedAt: string | Date;
}
