'use client';

import type { DocumentType } from '@/app/_lib/constants';
import { DOCUMENT_TYPES_LABELS } from '@/app/_lib/constants';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Download, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useToast } from '@/app/_lib/hooks/use-toast';
import { useContracts } from '@/app/_lib/hooks/useContracts';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface Contract {
    id: string;
    type: DocumentType;
    startDate: string;
    endDate: string | null;
    employee: {
        firstName: string;
        lastName: string;
    };
    isOwner: boolean;
    authorName: string | null;
}

interface ContractsListProps {
    initialContracts: Contract[];
}

export const ContractsList = ({
    initialContracts = [],
}: ContractsListProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [deleteContract, setDeleteContract] = useState<Contract | null>(null);
    const { deleteContract: deleteContractMutation, isDeleting } =
        useContracts();

    const handleDelete = async (contract: Contract) => {
        if (!contract.isOwner) {
            toast({
                title: 'Erreur',
                description: "Vous n'êtes pas autorisé à supprimer ce contrat",
                variant: 'error',
            });
            return;
        }

        try {
            await deleteContractMutation(contract.id);
        } finally {
            setDeleteContract(null);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold'>Contrats</h2>
                <Button asChild>
                    <Link href='/dashboard/contracts/create'>
                        <Plus className='mr-2 h-4 w-4' />
                        Nouveau contrat
                    </Link>
                </Button>
            </div>

            <div className='border rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employé</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date de début</TableHead>
                            <TableHead>Date de fin</TableHead>
                            <TableHead>Auteur</TableHead>
                            <TableHead className='text-right'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialContracts.length > 0 ? (
                            initialContracts.map((contract) => (
                                <TableRow key={contract.id}>
                                    <TableCell>
                                        {contract.employee.lastName}{' '}
                                        {contract.employee.firstName}
                                    </TableCell>
                                    <TableCell>
                                        {DOCUMENT_TYPES_LABELS[contract.type]}
                                    </TableCell>
                                    <TableCell>
                                        {format(
                                            new Date(contract.startDate),
                                            'dd MMMM yyyy',
                                            { locale: fr }
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {contract.endDate
                                            ? format(
                                                  new Date(contract.endDate),
                                                  'dd MMMM yyyy',
                                                  { locale: fr }
                                              )
                                            : 'Indéterminée'}
                                    </TableCell>
                                    <TableCell>{contract.authorName}</TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-end gap-2'>
                                            {contract.isOwner ? (
                                                <>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() =>
                                                            router.push(
                                                                `/dashboard/contracts/edit/${contract.id}`
                                                            )
                                                        }
                                                    >
                                                        <Pencil className='h-4 w-4' />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        onClick={() =>
                                                            setDeleteContract(
                                                                contract
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className='h-4 w-4 text-red-500' />
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button
                                                    variant='ghost'
                                                    size='icon'
                                                    onClick={() =>
                                                        router.push(
                                                            `/dashboard/contracts/${contract.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className='h-4 w-4' />
                                                </Button>
                                            )}
                                            <Button
                                                variant='ghost'
                                                size='icon'
                                                onClick={() =>
                                                    router.push(
                                                        `/api/contracts/${contract.id}/download`
                                                    )
                                                }
                                            >
                                                <Download className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className='h-24 text-center'
                                >
                                    Aucun contrat trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DeleteConfirmDialog
                isOpen={!!deleteContract}
                onClose={() => setDeleteContract(null)}
                onConfirm={() => deleteContract && handleDelete(deleteContract)}
                title={deleteContract?.employee.firstName || ''}
                isLoading={isDeleting}
            />
        </div>
    );
};
