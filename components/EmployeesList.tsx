'use client';

import { useState } from 'react';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useToast } from '@/app/_lib/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useEmployees } from '@/app/_lib/hooks/useEmployees';
import { EmployeeWithContract } from '@/app/_lib/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { DeleteEmployeeWithContractDialog } from './DeleteEmployeeWithContractDialog';

interface EmployeesListProps {
    initialEmployees: EmployeeWithContract[];
}

export const EmployeesList = ({
    initialEmployees = [],
}: EmployeesListProps) => {
    const router = useRouter();
    const { toast } = useToast();
    const [deleteEmployee, setDeleteEmployee] =
        useState<EmployeeWithContract | null>(null);
    const [showContractWarning, setShowContractWarning] = useState(false);
    const {
        deleteEmployee: deleteEmployeeMutation,
        isDeleting,
        employees = initialEmployees,
    } = useEmployees();

    const handleDeleteClick = (employee: EmployeeWithContract) => {
        if (employee.contract) {
            setShowContractWarning(true);
        }
        setDeleteEmployee(employee);
    };

    const handleDelete = async (employee: EmployeeWithContract) => {
        if (!employee.isOwner) {
            toast({
                title: 'Erreur',
                description: "Vous n'êtes pas autorisé à supprimer cet employé",
                variant: 'error',
            });
            return;
        }

        try {
            await deleteEmployeeMutation(employee.id);
            setDeleteEmployee(null);
            setShowContractWarning(false);
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <h2 className='text-xl font-semibold'>Liste des employés</h2>
                <Button
                    onClick={() => router.push('/dashboard/employees/create')}
                >
                    Nouvel employé
                </Button>
            </div>

            <div className='border rounded-lg'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Date de naissance</TableHead>
                            <TableHead>N° SS</TableHead>
                            <TableHead>Contrat</TableHead>
                            <TableHead className='text-right'>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>
                                    {employee.lastName} {employee.firstName}
                                </TableCell>
                                <TableCell>
                                    {format(new Date(employee.birthdate), 'P', {
                                        locale: fr,
                                    })}
                                </TableCell>
                                <TableCell>{employee.ssn}</TableCell>
                                <TableCell>
                                    {employee.contract ? (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => {
                                                if (employee.contract) {
                                                    router.push(
                                                        `/dashboard/contracts/view/${employee.contract.id}`
                                                    );
                                                }
                                            }}
                                        >
                                            <FileText className='h-4 w-4 mr-2' />
                                            Voir le contrat
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/contracts/create/${employee.id}`
                                                )
                                            }
                                        >
                                            Créer un contrat
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell className='text-right space-x-2'>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                            router.push(
                                                `/dashboard/employees/edit?id=${employee.id}`
                                            )
                                        }
                                    >
                                        <Pencil className='h-4 w-4' />
                                    </Button>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                            handleDeleteClick(employee)
                                        }
                                    >
                                        <Trash2 className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {showContractWarning ? (
                <DeleteEmployeeWithContractDialog
                    isOpen={!!deleteEmployee}
                    onClose={() => {
                        setDeleteEmployee(null);
                        setShowContractWarning(false);
                    }}
                    onConfirm={() =>
                        deleteEmployee && handleDelete(deleteEmployee)
                    }
                    title={
                        deleteEmployee
                            ? `${deleteEmployee.lastName} ${deleteEmployee.firstName}`
                            : ''
                    }
                    isLoading={isDeleting}
                />
            ) : (
                <DeleteConfirmDialog
                    isOpen={!!deleteEmployee}
                    onClose={() => setDeleteEmployee(null)}
                    onConfirm={() =>
                        deleteEmployee && handleDelete(deleteEmployee)
                    }
                    title={
                        deleteEmployee
                            ? `${deleteEmployee.lastName} ${deleteEmployee.firstName}`
                            : ''
                    }
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
};
