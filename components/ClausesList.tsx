'use client';

import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import { DraggableList } from '@/components/DraggableList';
import { Button } from '@/components/ui/button';
import type { Clause } from '@prisma/client';

interface ClausesListProps {
    initialClauses: Clause[];
}

export const ClausesList = ({ initialClauses }: ClausesListProps) => {
    const [clauses, setClauses] = useState<Clause[]>(initialClauses);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
    const router = useRouter();

    useEffect(() => {
        setClauses(initialClauses);
    }, [initialClauses]);

    const handleReorder = async (newClauses: Clause[]) => {
        setClauses(newClauses);
        try {
            const response = await fetch('/api/clauses/reorder', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clauses: newClauses.map((clause, index) => ({
                        id: clause.id,
                        order: index,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to reorder clauses');
            }
        } catch (error) {
            console.error('Error reordering clauses:', error);
        }
    };

    const handleEdit = (clause: Clause) => {
        router.push(`/dashboard/clauses/edit/${clause.id}`);
    };

    const handleDelete = async (clause: Clause) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/clauses/${clause.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete clause');
            }

            setClauses((prev) => prev.filter((c) => c.id !== clause.id));
            router.refresh();
        } catch (error) {
            console.error('Error deleting clause:', error);
        } finally {
            setIsLoading(false);
            setSelectedClause(null);
        }
    };

    const renderClause = (clause: Clause) => (
        <div className='flex items-center justify-between w-full bg-white p-4 rounded-lg shadow-sm'>
            <h3 className='text-lg font-medium text-gray-900'>
                {clause.title}
            </h3>
            <div className='flex space-x-2'>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleEdit(clause)}
                    className='text-gray-600 hover:text-blue-600'
                >
                    <Pencil className='h-4 w-4' />
                    <span className='sr-only'>Éditer</span>
                </Button>
                <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setSelectedClause(clause)}
                    className='text-gray-600 hover:text-red-600'
                >
                    <Trash2 className='h-4 w-4' />
                    <span className='sr-only'>Supprimer</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold'>Liste des clauses</h2>
                <Link href='/dashboard/clauses/create'>
                    <Button>Nouvelle clause</Button>
                </Link>
            </div>

            {clauses.length > 0 ? (
                <DraggableList
                    items={clauses}
                    onReorder={handleReorder}
                    renderItem={renderClause}
                />
            ) : (
                <p className='text-center text-gray-500'>
                    Aucune clause trouvée.
                </p>
            )}

            <DeleteConfirmDialog
                isOpen={!!selectedClause}
                isLoading={isLoading}
                onClose={() => setSelectedClause(null)}
                onConfirm={() => selectedClause && handleDelete(selectedClause)}
                title='Supprimer la clause'
            />
        </div>
    );
};
