'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export type ClauseWithAuthor = {
    id: string;
    title: string;
    content: string;
    category: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
    authorName: string | null;
};

export const columns: ColumnDef<ClauseWithAuthor>[] = [
    {
        accessorKey: 'title',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant='ghost'
                    className='w-full flex justify-between'
                    onClick={() => column.toggleSorting(isSorted === 'asc')}
                >
                    Titre
                    {isSorted === 'asc' ? (
                        <ArrowDown className='ml-2 h-4 w-4' />
                    ) : isSorted === 'desc' ? (
                        <ArrowUp className='ml-2 h-4 w-4' />
                    ) : null}
                </Button>
            );
        },
        enableHiding: false,
    },
    {
        accessorKey: 'authorName',
        header: 'Auteur',
        cell: ({ row }) => {
            const isOwner = row.original.isOwner;
            return isOwner ? 'Moi' : row.getValue('authorName') || 'Inconnu';
        },
    },
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => {
            const isSorted = column.getIsSorted();
            return (
                <Button
                    variant='ghost'
                    className='w-full flex justify-between'
                    onClick={() => column.toggleSorting(isSorted === 'asc')}
                >
                    Dernière modification
                    {isSorted === 'asc' ? (
                        <ArrowDown className='ml-2 h-4 w-4' />
                    ) : isSorted === 'desc' ? (
                        <ArrowUp className='ml-2 h-4 w-4' />
                    ) : null}
                </Button>
            );
        },
        cell: ({ row }) => {
            return new Date(row.getValue('updatedAt')).toLocaleDateString(
                'fr-FR',
                {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                }
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
            const clause = row.original;
            const { toast } = useToast();
            const router = useRouter();

            const handleDelete = async () => {
                try {
                    const response = await fetch(`/api/clauses/${clause.id}`, {
                        method: 'DELETE',
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(
                            data.error || 'Une erreur est survenue'
                        );
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

            return clause.isOwner ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                            <span className='sr-only'>Actions</span>
                            <MoreHorizontal className='h-4 w-4' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                            onClick={() =>
                                (window.location.href = `/dashboard/clauses/edit/${clause.id}`)
                            }
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
            ) : null;
        },
    },
];
