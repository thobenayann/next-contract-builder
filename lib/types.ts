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
export interface ContractFormData {
    type: string;
    startDate: string;
    endDate?: string;
    employeeId: string;
    selectedClauses: Clause[];
}

// Types pour les composants
export interface DraggableClause extends Clause {
    isSelected?: boolean;
}
