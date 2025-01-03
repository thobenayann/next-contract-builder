'use client';

import { useOrganizations } from '@/app/_lib/hooks/use-organizations';
import { cn } from '@/app/_lib/utils';
import { Building2, ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    const [newOrgName, setNewOrgName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const {
        organizations,
        activeOrg,
        isLoading,
        createOrganization,
        isCreating,
        switchOrganization,
        isSwitching,
    } = useOrganizations();

    const handleCreateOrganization = () => {
        if (!newOrgName.trim()) return;

        const slug = newOrgName.toLowerCase().replace(/\s+/g, '-');
        createOrganization(
            { name: newOrgName, slug },
            {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setNewOrgName('');
                    router.refresh();
                },
            }
        );
    };

    const handleSwitchOrganization = (organizationId: string) => {
        switchOrganization(organizationId, {
            onSuccess: () => {
                router.refresh();
            },
        });
    };

    return (
        <div className='w-full'>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        className='flex w-full items-center justify-between gap-2 px-2 py-1.5'
                        disabled={isLoading || isSwitching}
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
                            disabled={isSwitching}
                        >
                            {org.name}
                            {activeOrg?.id === org.id && (
                                <span className='text-xs text-purple-500'>
                                    Active
                                </span>
                            )}
                        </DropdownMenuItem>
                    ))}
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                disabled={isCreating}
                            >
                                <Plus className='h-4 w-4 mr-2' />
                                Nouvelle organisation
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Créer une nouvelle organisation
                                </DialogTitle>
                                <DialogDescription>
                                    Ajoutez une nouvelle organisation à votre
                                    compte.
                                </DialogDescription>
                            </DialogHeader>
                            <div className='space-y-4'>
                                <Input
                                    placeholder="Nom de l'organisation"
                                    value={newOrgName}
                                    onChange={(e) =>
                                        setNewOrgName(e.target.value)
                                    }
                                    disabled={isCreating}
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
