'use client';

import { useClauses } from '@/app/_lib/hooks/use-clauses';
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
    const router = useRouter();
    const { deleteClause, isDeleting } = useClauses();

    const handleDelete = async () => {
        deleteClause(id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='h-8 w-8 p-0'
                    disabled={isDeleting}
                >
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
                    disabled={isDeleting}
                >
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
