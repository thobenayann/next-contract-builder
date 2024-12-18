'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { ContractWithRelations } from '@/lib/types';
import { DOCUMENT_TYPES_LABELS } from '@/lib/constants';

export function ContractsList({
    initialContracts = [],
}: {
    initialContracts: ContractWithRelations[];
}) {
    const router = useRouter();
    const { addToast } = useToast();
    const [contracts, setContracts] = useState(initialContracts);
    const [deleteContract, setDeleteContract] =
        useState<ContractWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!deleteContract) return;
        setIsLoading(true);

        try {
            const response = await fetch(
                `/api/contracts/${deleteContract.id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            setContracts(contracts.filter((c) => c.id !== deleteContract.id));
            addToast({
                title: 'Succès',
                description: 'Contrat supprimé avec succès',
                type: 'success',
            });
            setDeleteContract(null);
            router.refresh();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            addToast({
                title: 'Erreur',
                description: 'Impossible de supprimer le contrat',
                type: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Liste des contrats</h2>
                <Button
                    onClick={() => router.push('/dashboard/contracts/create')}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau contrat
                </Button>
            </div>

            {contracts.length === 0 ? (
                <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">
                        Aucun contrat n&apos;a encore été créé.
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Employé</TableHead>
                                <TableHead>Date de début</TableHead>
                                <TableHead>Date de fin</TableHead>
                                <TableHead>Clauses</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell>
                                        {
                                            DOCUMENT_TYPES_LABELS[
                                                contract.type as keyof typeof DOCUMENT_TYPES_LABELS
                                            ]
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {contract.employee.lastName}{' '}
                                        {contract.employee.firstName}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(contract.startDate),
                                            'P',
                                            {
                                                locale: fr,
                                            }
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {contract.endDate
                                            ? format(
                                                  new Date(contract.endDate),
                                                  'P',
                                                  {
                                                      locale: fr,
                                                  }
                                              )
                                            : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {contract.clauses.length} clause(s)
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/contracts/edit?id=${contract.id}`
                                                )
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                setDeleteContract(contract)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={!!deleteContract}
                onClose={() => setDeleteContract(null)}
                onConfirm={handleDelete}
                title={
                    deleteContract
                        ? `le contrat de ${deleteContract.employee.lastName} ${deleteContract.employee.firstName}`
                        : ''
                }
                isLoading={isLoading}
            />
        </div>
    );
}
