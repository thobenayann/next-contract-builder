'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Clause } from '@prisma/client';

interface ClauseSelectorProps {
    availableClauses: Clause[];
    selectedClauses: Clause[];
    onSelect: (clause: Clause) => void;
}

export const ClauseSelector = ({
    availableClauses,
    selectedClauses,
    onSelect,
}: ClauseSelectorProps) => {
    const unselectedClauses = availableClauses.filter(
        (clause) => !selectedClauses.find((sc) => sc.id === clause.id)
    );

    if (unselectedClauses.length === 0) {
        return (
            <div className='text-sm text-muted-foreground'>
                Toutes les clauses disponibles ont été ajoutées
            </div>
        );
    }

    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium'>Ajouter une clause</label>
            <Select
                onValueChange={(value) => {
                    const clause = availableClauses.find((c) => c.id === value);
                    if (clause) onSelect(clause);
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder='Sélectionner une clause' />
                </SelectTrigger>
                <SelectContent>
                    {unselectedClauses.map((clause) => (
                        <SelectItem key={clause.id} value={clause.id}>
                            {clause.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
