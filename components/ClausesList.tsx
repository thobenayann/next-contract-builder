'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';

import type { Clause } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { DraggableList } from './DraggableList';

interface ClausesListProps {
    initialClauses: Clause[];
}

export const ClausesList = ({ initialClauses = [] }: ClausesListProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [clauses, setClauses] = useState<Clause[]>(initialClauses);
    const [deleteClause, setDeleteClause] = useState<Clause | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasOrderChanged, setHasOrderChanged] = useState(false);

    useEffect(() => {
        const orderChanged = initialClauses.some((clause, index) => {
            return clause.id !== clauses[index]?.id;
        });
        setHasOrderChanged(orderChanged);
    }, [clauses, initialClauses]);

    if (initialClauses.length === 0) {
        return (
            <div className='text-center p-8 border border-dashed rounded-lg'>
                <p className='text-muted-foreground'>
                    Aucune clause n&apos;a encore été créée.
                </p>
            </div>
        );
    }

    const handleEditClick = (clause: Clause) => {
        router.push(`/clauses/edit?id=${clause.id}`);
    };

    const handleDeleteClick = (clause: Clause) => {
        setDeleteClause(clause);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteClause) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/clauses/${deleteClause.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression');
            }

            setClauses((prev) => prev.filter((c) => c.id !== deleteClause.id));

            toast({
                title: 'Suppression réussie',
                description: 'La clause a été supprimée avec succès',
                variant: 'success',
            });

            setDeleteClause(null);

            router.refresh();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer la clause',
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveOrder = async () => {
        if (!hasOrderChanged) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/contracts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Nouveau contrat',
                    clauses: clauses.map((clause, index) => ({
                        id: clause.id,
                        order: index,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la sauvegarde');
            }

            toast({
                title: 'Succès',
                description: "L'ordre des clauses a été sauvegardé",
                variant: 'success',
            });
            router.refresh();
            setHasOrderChanged(false);
        } catch (error: unknown) {
            console.error('Erreur lors de la sauvegarde:', error);
            toast({
                title: 'Erreur',
                description: "Impossible de sauvegarder l'ordre",
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>Clauses de contrat</h2>
                <Button onClick={() => router.push('/clauses/create')}>
                    Nouvelle clause
                </Button>
            </div>

            <DraggableList
                items={clauses}
                setItems={setClauses}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />
            <Button
                onClick={handleSaveOrder}
                disabled={isLoading || !hasOrderChanged}
                className='w-full'
                variant={hasOrderChanged ? 'default' : 'secondary'}
            >
                {isLoading ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Sauvegarde en cours...
                    </>
                ) : hasOrderChanged ? (
                    "Sauvegarder l'ordre"
                ) : (
                    'Aucun changement à sauvegarder'
                )}
            </Button>

            <DeleteConfirmDialog
                isOpen={!!deleteClause}
                onClose={() => setDeleteClause(null)}
                onConfirm={handleDeleteConfirm}
                title={deleteClause?.title || ''}
                isLoading={isLoading}
            />
        </div>
    );
};
