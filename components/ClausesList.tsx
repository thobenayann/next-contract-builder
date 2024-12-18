'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DraggableList } from './DraggableList';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Clause } from '@prisma/client';

export function ClausesList({
    initialClauses = [],
}: {
    initialClauses: Clause[];
}) {
    const router = useRouter();
    const { addToast } = useToast();
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

            addToast({
                title: 'Suppression réussie',
                description: 'La clause a été supprimée avec succès',
                type: 'success',
            });

            setDeleteClause(null);

            router.refresh();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            addToast({
                title: 'Erreur',
                description: 'Impossible de supprimer la clause',
                type: 'error',
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

            addToast({
                title: 'Succès',
                description: "L'ordre des clauses a été sauvegardé",
                type: 'success',
            });
            router.refresh();
            setHasOrderChanged(false);
        } catch (error: unknown) {
            console.error('Erreur lors de la sauvegarde:', error);
            addToast({
                title: 'Erreur',
                description: "Impossible de sauvegarder l'ordre",
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Clauses de contrat</h2>
                <Button onClick={() => router.push('/clauses/create')}>
                    Nouvelle clause
                </Button>
            </div>

            {clauses.length === 0 ? (
                <p className="text-gray-500">
                    Aucune clause n&apos;a encore été créée.
                </p>
            ) : (
                <>
                    <DraggableList
                        items={clauses}
                        setItems={setClauses}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
                    <Button
                        onClick={handleSaveOrder}
                        disabled={isLoading || !hasOrderChanged}
                        className="w-full"
                        variant={hasOrderChanged ? 'default' : 'secondary'}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sauvegarde en cours...
                            </>
                        ) : hasOrderChanged ? (
                            "Sauvegarder l'ordre"
                        ) : (
                            'Aucun changement à sauvegarder'
                        )}
                    </Button>
                </>
            )}

            <DeleteConfirmDialog
                isOpen={!!deleteClause}
                onClose={() => setDeleteClause(null)}
                onConfirm={handleDeleteConfirm}
                title={deleteClause?.title || ''}
                isLoading={isLoading}
            />
        </div>
    );
}
