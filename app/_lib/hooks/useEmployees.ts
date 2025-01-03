'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmployeeWithContract } from '../types';
import { EmployeeFormData } from '../validations/schemas/employee.schema';
import { useToast } from './use-toast';

export function useEmployees() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const employeesQuery = useQuery<EmployeeWithContract[], Error>({
        queryKey: ['employees'],
        queryFn: async () => {
            const response = await fetch('/api/employees');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des employés');
            }
            return response.json();
        },
    });

    const createMutation = useMutation({
        mutationFn: async (data: EmployeeFormData) => {
            const response = await fetch('/api/employees/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la création');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({
                title: 'Succès! 🎉',
                description: 'Employé créé avec succès',
                variant: 'success',
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: EmployeeFormData;
        }) => {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || 'Erreur lors de la modification'
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({
                title: '! 🎉',
                description: 'Employé modifié avec succès',
                variant: 'success',
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.message || "Impossible de supprimer l'employé"
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({
                title: 'Succès 🗑️',
                description: 'Employé supprimé avec succès',
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Erreur',
                description: error.message,
                variant: 'error',
            });
        },
    });

    return {
        employees: employeesQuery.data,
        isLoading:
            employeesQuery.isLoading ||
            createMutation.isPending ||
            updateMutation.isPending,
        isError: employeesQuery.isError,
        createEmployee: createMutation.mutate,
        updateEmployee: updateMutation.mutate,
        deleteEmployee: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
    };
}
