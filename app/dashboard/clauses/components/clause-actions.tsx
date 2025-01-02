'use client';

import { useToast } from '@/app/_lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ClauseActionsProps {
    id: string;
}

export const ClauseActions = ({ id }: ClauseActionsProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/clauses/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            toast({
                title: 'Succès',
                description: 'Clause supprimée avec succès',
                variant: 'success',
            });

            router.refresh();
        } catch (error) {
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Erreur lors de la suppression',
                variant: 'error',
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Actions</span>
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuItem
                    onClick={() => router.push(`/dashboard/clauses/edit/${id}`)}
                >
                    Modifier
                </DropdownMenuItem>
                <DropdownMenuItem
                    className='text-red-600'
                    onClick={handleDelete}
                >
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
