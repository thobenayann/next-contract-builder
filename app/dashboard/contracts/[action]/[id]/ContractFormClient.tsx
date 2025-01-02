'use client';

import { useToast } from '@/app/_lib/hooks/use-toast';
import { ContractFormClientProps } from '@/app/_lib/types';
import { ContractFormData, contractSchema } from '@/app/_lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ContractFormUI } from './ContractFormUI';

export const ContractFormClient = ({
    action,
    initialData,
    employeeId,
    contractId,
}: ContractFormClientProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const isViewMode = action === 'view';
    const isEditing = action === 'edit';

    const { mutate: createContract, isPending: isCreating } = useMutation({
        mutationFn: async (data: ContractFormData) => {
            const response = await fetch('/api/contracts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || result.error);
            }
            return result;
        },
        onSuccess: () => {
            toast({
                title: 'Succès',
                description: 'Contrat créé avec succès 🎉',
                variant: 'success',
            });
            router.push('/dashboard/contracts');
            router.refresh();
        },
        onError: (error: Error) => {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'error',
            });
        },
    });

    const { mutate: updateContract, isPending: isUpdating } = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: ContractFormData;
        }) => {
            const response = await fetch(`/api/contracts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || result.error);
            }
            return result;
        },
        onSuccess: () => {
            toast({
                title: 'Succès',
                description: 'Contrat mis à jour avec succès',
                variant: 'success',
            });
            router.push('/dashboard/contracts');
            router.refresh();
        },
        onError: (error: Error) => {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'error',
            });
        },
    });

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
        if (isEditing && contractId) {
            updateContract({ id: contractId, data });
        } else {
            createContract(data);
        }
    };

    return (
        <ContractFormUI
            form={form}
            isViewMode={isViewMode}
            isEditing={isEditing}
            isSubmitting={isEditing ? isUpdating : isCreating}
            onSubmit={onSubmit}
            availableClauses={initialData.clauses}
            employees={initialData.employees}
            contractId={contractId}
        />
    );
};

export default ContractFormClient;
