'use client';

import { authClient } from '@/app/_lib/auth-client';
import { cn } from '@/app/_lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Organization } from '@prisma/client';
import { Building2, ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';

export const OrganizationSwitcher = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [newOrgName, setNewOrgName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrganizations = async () => {
            try {
                const response = await fetch('/api/organizations');
                if (!response.ok) throw new Error('Erreur de chargement');

                const data = await response.json();
                setActiveOrg(data.activeOrg);
                setOrganizations(data.organizations);
            } catch (error) {
                console.error('Erreur chargement organisations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadOrganizations();
    }, []);

    const handleCreateOrganization = async () => {
        if (!newOrgName.trim()) return;

        try {
            setIsCreating(true);
            const result = await authClient.organization.create({
                name: newOrgName,
                slug: newOrgName.toLowerCase().replace(/\s+/g, '-'),
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            const now = new Date();
            const newOrg: Organization = {
                id: result.data.id,
                name: result.data.name,
                slug: result.data.slug,
                metadata: result.data.metadata ?? null,
                createdAt: new Date(result.data.createdAt),
                updatedAt: now,
                logo: result.data.logo ?? null,
            };

            setOrganizations((prev) => [...prev, newOrg]);
            setActiveOrg(newOrg);

            toast({
                title: 'Succès',
                description: 'Organisation créée avec succès',
                variant: 'success',
            });
            setNewOrgName('');
            router.refresh();
        } catch (error) {
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : "Impossible de créer l'organisation",
                variant: 'error',
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleSwitchOrganization = async (organizationId: string) => {
        try {
            const result = await authClient.organization.setActive({
                organizationId,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            const newActiveOrg = organizations.find(
                (org) => org.id === organizationId
            );
            setActiveOrg(newActiveOrg ?? null);
            router.refresh();
        } catch (error) {
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : "Impossible de changer d'organisation",
                variant: 'error',
            });
        }
    };

    return (
        <div className='w-full'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex w-full items-center justify-between gap-2 px-2 py-1.5'
                        disabled={isLoading}
                    >
                        <div className='flex items-center gap-2 truncate'>
                            <Building2 className='h-4 w-4' />
                            <span className='truncate'>
                                {isLoading
                                    ? 'Chargement...'
                                    : activeOrg?.name ?? 'Mon organisation'}
                            </span>
                        </div>
                        <ChevronDown className='h-4 w-4 opacity-50' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align='start'
                    className='w-[200px]'
                    side='right'
                >
                    {organizations.map((org) => (
                        <DropdownMenuItem
                            key={org.id}
                            onClick={() => handleSwitchOrganization(org.id)}
                            className={cn(
                                'flex items-center justify-between',
                                activeOrg?.id === org.id &&
                                    'bg-purple-500/10 text-purple-500'
                            )}
                        >
                            {org.name}
                            {activeOrg?.id === org.id && (
                                <span className='text-xs text-purple-500'>
                                    Active
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                    <Dialog>
                        <DialogTrigger asChild>
                            <DropdownMenuItem>
                                <Plus className='h-4 w-4 mr-2' />
                                Nouvelle organisation
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Créer une nouvelle organisation
                                </DialogTitle>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <Input
                                    placeholder="Nom de l'organisation"
                                    value={newOrgName}
                                    onChange={(e) =>
                                        setNewOrgName(e.target.value)
                                    }
                                />
                                <Button
                                    onClick={handleCreateOrganization}
                                    disabled={isCreating || !newOrgName.trim()}
                                >
                                    Créer
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
