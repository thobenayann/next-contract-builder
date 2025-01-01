'use client';

import { ContractFormClientProps } from '@/app/_lib/types';
import { ContractFormData, contractSchema } from '@/app/_lib/validations';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ContractFormUI } from './ContractFormUI';

const ContractFormClient = ({
    action,
    initialData,
    employeeId,
    contractId,
}: ContractFormClientProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const isViewMode = action === 'view';
    const isEditing = action === 'edit';

    const form = useForm<ContractFormData>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            type: initialData.contract?.type || 'CONTRACT',
            startDate: initialData.contract?.startDate
                ? new Date(initialData.contract.startDate)
                      .toISOString()
                      .split('T')[0]
                : '',
            endDate: initialData.contract?.endDate
                ? new Date(initialData.contract.endDate)
                      .toISOString()
                      .split('T')[0]
                : null,
            employeeId: employeeId || initialData.contract?.employeeId || '',
            selectedClauses:
                initialData.contract?.clauses.map((c) => ({
                    ...c.clause,
                    order: c.order,
                    createdAt: new Date(c.clause.createdAt).toISOString(),
                    updatedAt: new Date(c.clause.updatedAt).toISOString(),
                })) || [],
        },
    });

    const onSubmit = async (data: ContractFormData) => {
        try {
            const response = await fetch(
                isEditing
                    ? `/api/contracts/${contractId}`
                    : '/api/contracts/create',
                {
                    method: isEditing ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

            toast({
                title: 'Succès',
                description: isEditing ? 'Contrat mis à jour' : 'Contrat créé',
                variant: 'success',
            });

            router.push('/dashboard/contracts');
            router.refresh();
        } catch (error) {
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Une erreur est survenue',
                variant: 'error',
            });
        }
    };

    return (
        <ContractFormUI
            form={form}
            isViewMode={isViewMode}
            isEditing={isEditing}
            onSubmit={onSubmit}
            availableClauses={initialData.clauses}
            employees={initialData.employees}
            contractId={contractId}
        />
    );
};

export default ContractFormClient;
