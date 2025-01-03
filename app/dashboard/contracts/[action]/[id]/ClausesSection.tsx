'use client';

import { ClauseSelector } from '@/components/ClauseSelector';
import { DraggableList } from '@/components/DraggableList';
import type { Clause } from '@prisma/client';
import { useFormContext } from 'react-hook-form';

interface ClausesSectionProps {
    isViewMode: boolean;
    availableClauses: Clause[];
}

export const ClausesSection = ({
    isViewMode,
    availableClauses,
}: ClausesSectionProps) => {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const selectedClauses = watch('selectedClauses') || [];

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h3 className='text-lg font-semibold'>Clauses du contrat</h3>
                {!isViewMode && (
                    <ClauseSelector
                        availableClauses={availableClauses}
                        selectedClauses={selectedClauses}
                        onSelect={(clause) => {
                            setValue('selectedClauses', [
                                ...selectedClauses,
                                {
                                    ...clause,
                                    order: selectedClauses.length,
                                    createdAt: new Date(
                                        clause.createdAt
                                    ).toISOString(),
                                    updatedAt: new Date(
                                        clause.updatedAt
                                    ).toISOString(),
                                },
                            ]);
                        }}
                    />
                )}
            </div>

            {selectedClauses.length === 0 ? (
                <div className='text-center p-8 border border-dashed rounded-lg'>
                    <p className='text-muted-foreground'>
                        Aucune clause n&apos;a été ajoutée à ce contrat.
                    </p>
                    {errors.selectedClauses && (
                        <p className='text-sm text-destructive mt-2'>
                            {errors.selectedClauses.message as string}
                        </p>
                    )}
                </div>
            ) : (
                <DraggableList
                    items={selectedClauses.map((clause: Clause) => ({
                        ...clause,
                        createdAt: new Date(clause.createdAt),
                        updatedAt: new Date(clause.updatedAt),
                        userId: clause.userId || '',
                    }))}
                    setItems={(newClauses) => {
                        if (!isViewMode) {
                            setValue(
                                'selectedClauses',
                                newClauses.map((clause, index) => ({
                                    ...clause,
                                    order: index,
                                    createdAt: clause.createdAt.toISOString(),
                                    updatedAt: clause.updatedAt.toISOString(),
                                }))
                            );
                        }
                    }}
                    onEdit={() => {}}
                    onDelete={(clause) => {
                        if (!isViewMode) {
                            setValue(
                                'selectedClauses',
                                selectedClauses
                                    .filter((c: Clause) => c.id !== clause.id)
                                    .map((c: Clause, index: number) => ({
                                        ...c,
                                        order: index,
                                    }))
                            );
                        }
                    }}
                    isFormContext={true}
                    preventRefresh={true}
                    disabled={isViewMode}
                />
            )}
        </div>
    );
};
