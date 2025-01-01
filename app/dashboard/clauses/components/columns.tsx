'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ClauseActions } from './clause-actions';

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
            return clause.isOwner ? <ClauseActions id={clause.id} /> : null;
        },
    },
];
