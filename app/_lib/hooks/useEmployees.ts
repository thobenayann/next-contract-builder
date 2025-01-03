import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EmployeeWithContract } from '../types';
import { useToast } from './use-toast';

export function useEmployees() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Récupération des employés
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

    // Suppression d'un employé
    const deleteEmployeeMutation = useMutation<void, Error, string>({
        mutationFn: async (id) => {
            const response = await fetch(`/api/employees/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(
                    result?.error || "Impossible de supprimer l'employé"
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['employees'] });
            toast({
                title: 'Succès! 🎉',
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
        isLoading: employeesQuery.isLoading,
        isError: employeesQuery.isError,
        deleteEmployee: deleteEmployeeMutation.mutate,
        isDeleting: deleteEmployeeMutation.isPending,
    };
}
