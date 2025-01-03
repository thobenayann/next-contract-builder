'use client';

import { ClauseWithAuthor } from '@/app/dashboard/clauses/components/columns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ClauseFormData } from '../validations/schemas/clause.schema';
import { useToast } from './use-toast';

export function useClauses() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Récupération des clauses
    const clausesQuery = useQuery<ClauseWithAuthor[]>({
        queryKey: ['clauses'],
        queryFn: async () => {
            const response = await fetch('/api/clauses');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des clauses');
            }
            return response.json();
        },
    });

    // Création d'une clause
    const createClauseMutation = useMutation({
        mutationFn: async (data: ClauseFormData) => {
            const response = await fetch('/api/clauses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.issues) {
                    throw { validationErrors: result.issues };
                }
                throw new Error(result.error || 'Une erreur est survenue');
            }

            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clauses'] });
            toast({
                title: 'Succès! 🎉',
                description: 'Clause créée avec succès',
                variant: 'success',
            });
        },
        onError: (error: any) => {
            toast({
                title: 'Erreur',
                description: error.message || 'Une erreur est survenue',
                variant: 'error',
            });
        },
    });

    // Mise à jour d'une clause
    const updateClauseMutation = useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: string;
            data: Partial<ClauseFormData>;
        }) => {
            const response = await fetch(`/api/clauses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur lors de la mise à jour');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clauses'] });
            toast({
                title: 'Succès! 🎉',
                description: 'Clause mise à jour avec succès',
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

    // Suppression d'une clause
    const deleteClauseMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/clauses/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur lors de la suppression');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clauses'] });
            toast({
                title: 'Succès',
                description: 'Clause supprimée avec succès',
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
        clauses: clausesQuery.data,
        isLoading: clausesQuery.isLoading,
        isError: clausesQuery.isError,
        createClause: createClauseMutation.mutate,
        updateClause: updateClauseMutation.mutate,
        deleteClause: deleteClauseMutation.mutate,
        isCreating: createClauseMutation.isPending,
        isUpdating: updateClauseMutation.isPending,
        isDeleting: deleteClauseMutation.isPending,
    };
}

export function useClause(id: string) {
    const { toast } = useToast();

    return useQuery<ClauseWithAuthor>({
        queryKey: ['clauses', id],
        queryFn: async () => {
            const response = await fetch(`/api/clauses/${id}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(
                    error.error || 'Erreur lors de la récupération de la clause'
                );
            }
            return response.json();
        },
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 heure
    });
}
