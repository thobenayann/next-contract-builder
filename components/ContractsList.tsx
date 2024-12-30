'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DOCUMENT_TYPES_LABELS } from '@/app/_lib/constants';
import type { ContractWithRelations } from '@/app/_lib/types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export const ContractsList = ({
    initialContracts = [],
}: {
    initialContracts: ContractWithRelations[];
}) => {
    const router = useRouter();
    const { toast } = useToast();
    const [contracts, setContracts] = useState(initialContracts);
    const [deleteContract, setDeleteContract] =
        useState<ContractWithRelations | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (contracts.length !== initialContracts.length) {
            router.refresh();
        }
    }, [contracts.length, initialContracts.length, router]);

    const handleDelete = async (contract: ContractWithRelations) => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/contracts/${contract.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression');

            setContracts((prev) => prev.filter((c) => c.id !== contract.id));
            toast({
                title: 'Succès',
                description: 'Le contrat a été supprimé',
                variant: 'success',
            });
            setDeleteContract(null);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer le contrat',
                variant: 'error',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (contract: ContractWithRelations) => {
        try {
            const response = await fetch(
                `/api/contracts/${contract.id}/download`
            );

            if (!response.ok) throw new Error('Erreur lors du téléchargement');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contrat_${contract.employee.lastName}_${contract.employee.firstName}.docx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            toast({
                title: 'Erreur',
                description: 'Impossible de télécharger le contrat',
                variant: 'error',
            });
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold'>Liste des contrats</h2>
                <Button
                    onClick={() => router.push('/dashboard/contracts/create')}
                >
                    <Plus className='h-4 w-4 mr-2' />
                    Nouveau contrat
                </Button>
            </div>

            {contracts.length === 0 ? (
                <div className='text-center p-8 border border-dashed rounded-lg'>
                    <p className='text-muted-foreground'>
                        Aucun contrat n&apos;a encore été créé.
                    </p>
                </div>
            ) : (
                <div className='border rounded-lg'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Employé</TableHead>
                                <TableHead>Date de début</TableHead>
                                <TableHead>Date de fin</TableHead>
                                <TableHead>Clauses</TableHead>
                                <TableHead className='text-right'>
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
                                    <TableCell className='text-right space-x-2'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/contracts/edit?id=${contract.id}`
                                                )
                                            }
                                        >
                                            <Pencil className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                                setDeleteContract(contract)
                                            }
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() =>
                                                handleDownload(contract)
                                            }
                                        >
                                            <Download className='h-4 w-4' />
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
                onConfirm={() => deleteContract && handleDelete(deleteContract)}
                title={deleteContract?.employee.firstName || ''}
                isLoading={isLoading}
            />
        </div>
    );
};
