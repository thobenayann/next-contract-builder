'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table } from '@tanstack/react-table';
import { Settings2 } from 'lucide-react';

interface ColumnToggleProps<TData> {
    table: Table<TData>;
}

const columnLabels: Record<string, string> = {
    content: 'Contenu',
    authorName: 'Auteur',
    updatedAt: 'Dernière modification',
};

export const ColumnToggle = <TData,>({ table }: ColumnToggleProps<TData>) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    className='ml-auto h-8 lg:flex'
                >
                    <Settings2 className='mr-2 h-4 w-4' />
                    Colonnes
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[150px]'>
                <DropdownMenuLabel>Colonnes affichées</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== 'undefined' &&
                            column.getCanHide()
                    )
                    .map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className='capitalize'
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                            }
                        >
                            {columnLabels[column.id] || column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
