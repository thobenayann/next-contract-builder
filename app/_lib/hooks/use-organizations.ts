'use client';

import { Organization } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLoadingBar } from './use-loading-bar';
import { useToast } from './use-toast';

interface OrganizationResponse {
    activeOrg: Organization | null;
    organizations: Organization[];
}

interface CreateOrganizationData {
    name: string;
    slug: string;
}

export function useOrganizations() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { startLoading, stopLoading } = useLoadingBar();

    const { data, isLoading } = useQuery<OrganizationResponse>({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await fetch('/api/organizations');
            if (!response.ok) {
                throw new Error('Erreur de chargement des organisations');
            }
            return response.json();
        },
    });

    const createOrganizationMutation = useMutation({
        mutationFn: async (data: CreateOrganizationData) => {
            const response = await fetch('/api/organizations/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organizations'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            toast({
                title: 'Succès! 🎉',
                description: 'Organisation créée avec succès',
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

    const switchOrganizationMutation = useMutation({
        mutationFn: async (organizationId: string) => {
            const response = await fetch('/api/organizations/set-active', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ organizationId }),
            });

            if (!response.ok) {
                throw new Error("Impossible de changer d'organisation");
            }

            return response.json();
        },
        onMutate: () => {
            startLoading();
        },
        onSuccess: async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ['dashboard-stats'],
                }),
                queryClient.invalidateQueries({ queryKey: ['organizations'] }),
                queryClient.invalidateQueries({ queryKey: ['employees'] }),
                queryClient.invalidateQueries({ queryKey: ['contracts'] }),
            ]);
        },
        onSettled: () => {
            stopLoading();
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
        organizations: data?.organizations ?? [],
        activeOrg: data?.activeOrg,
        isLoading,
        createOrganization: createOrganizationMutation.mutate,
        isCreating: createOrganizationMutation.isPending,
        switchOrganization: switchOrganizationMutation.mutate,
        isSwitching: switchOrganizationMutation.isPending,
    };
}
