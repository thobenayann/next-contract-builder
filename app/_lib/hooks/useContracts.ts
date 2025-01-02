import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContractFormData } from '../validations/schemas/contract.schema';
import { useToast } from './use-toast';

export function useContracts() {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    // Récupération des contrats
    const contractsQuery = useQuery({
        queryKey: ['contracts'],
        queryFn: async () => {
            const response = await fetch('/api/contracts');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des contrats');
            }
            return response.json();
        },
    });

    // Création d'un contrat
    const createContractMutation = useMutation({
        mutationFn: async (data: ContractFormData) => {
            const response = await fetch('/api/contracts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (
                    response.status === 409 &&
                    result.code === 'CONTRACT_EXISTS'
                ) {
                    throw new Error(result.message);
                }
                throw new Error(result.error || 'Erreur lors de la création');
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
        },
    });

    // Mise à jour d'un contrat
    const updateContractMutation = useMutation({
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

            if (!response.ok) {
                const result = await response.json();
                throw new Error(
                    result.error || 'Erreur lors de la mise à jour'
                );
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            toast({
                title: 'Succès',
                description: 'Contrat mis à jour avec succès',
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Erreur',
                description: error.message || 'Erreur lors de la mise à jour',
                variant: 'error',
            });
        },
    });

    // Ajout de la mutation de suppression
    const deleteContractMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/contracts/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);
                throw new Error(
                    result?.error || 'Erreur lors de la suppression'
                );
            }

            // Pour une réponse 204, pas besoin de parser le JSON
            if (response.status === 204) {
                return null;
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contracts'] });
            toast({
                title: 'Succès',
                description: 'Contrat supprimé avec succès',
                variant: 'success',
            });
        },
        onError: (error: Error) => {
            toast({
                title: 'Erreur',
                description: error.message || 'Erreur lors de la suppression',
                variant: 'error',
            });
        },
    });

    return {
        contracts: contractsQuery.data,
        isLoading: contractsQuery.isLoading,
        isError: contractsQuery.isError,
        createContract: createContractMutation.mutate,
        updateContract: updateContractMutation.mutate,
        deleteContract: deleteContractMutation.mutate,
        isCreating: createContractMutation.isPending,
        isUpdating: updateContractMutation.isPending,
        isDeleting: deleteContractMutation.isPending,
    };
}
