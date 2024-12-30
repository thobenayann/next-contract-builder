'use client';

import { use, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { DOCUMENT_TYPES, DOCUMENT_TYPES_LABELS } from '@/app/_lib/constants';
import {
    contractResolver,
    type ContractFormData,
} from '@/app/_lib/validations';
import { ClauseSelector } from '@/components/ClauseSelector';
import { DraggableList } from '@/components/DraggableList';
import { ContractFormSkeleton } from '@/components/skeletons/ContractFormSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { PageTransition } from '@/components/ui/transition';
import { useToast } from '@/hooks/use-toast';

import type { Clause } from '@prisma/client';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
}

interface AvailableClause extends Clause {
    isSelected?: boolean;
}

interface ContractClause {
    clause: Clause;
}

const ContractForm = (props: {
    params: Promise<{ action: string }>;
    searchParams: Promise<{ id?: string; employeeId?: string }>;
}) => {
    const searchParams = use(props.searchParams);
    const params = use(props.params);
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        control,
        setValue,
        watch,
    } = useForm<ContractFormData>({
        resolver: contractResolver,
        defaultValues: {
            type: 'CONTRACT',
            startDate: '',
            endDate: '',
            employeeId: searchParams.employeeId || '',
            selectedClauses: [],
        },
    });
    const [availableClauses, setAvailableClauses] = useState<AvailableClause[]>(
        []
    );
    const [employees, setEmployees] = useState<Employee[]>([]);
    const isEditing = params.action === 'edit';
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Charger les clauses et les employés disponibles
    useEffect(() => {
        Promise.all([
            fetch('/api/clauses').then((res) => res.json()),
            fetch('/api/employees').then((res) => res.json()),
            isEditing && searchParams.id
                ? fetch(`/api/contracts/${searchParams.id}`).then((res) =>
                      res.json()
                  )
                : Promise.resolve(null),
        ])
            .then(([clauses, employees, contract]) => {
                setAvailableClauses(
                    clauses.map((clause: Clause) => ({
                        ...clause,
                        category: clause.category || 'OPTIONAL',
                        createdAt: new Date(clause.createdAt),
                        updatedAt: new Date(clause.updatedAt),
                    }))
                );
                setEmployees(employees);

                if (contract) {
                    // Pré-remplir le formulaire avec les données du contrat
                    setValue('type', contract.type);
                    setValue(
                        'startDate',
                        new Date(contract.startDate).toISOString().split('T')[0]
                    );
                    if (contract.endDate) {
                        setValue(
                            'endDate',
                            new Date(contract.endDate)
                                .toISOString()
                                .split('T')[0]
                        );
                    }
                    setValue('employeeId', contract.employeeId);
                    setValue(
                        'selectedClauses',
                        contract.clauses.map((c: ContractClause) => c.clause)
                    );
                }
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données:', error);
                setError('root', {
                    type: 'manual',
                    message: 'Erreur lors du chargement des données',
                });
            })
            .finally(() => {
                setIsInitialLoading(false);
            });
    }, [isEditing, searchParams.id, setValue, setError]);

    const onSubmit = async (data: ContractFormData) => {
        setIsSubmitting(true);

        try {
            const url = isEditing
                ? `/api/contracts/${searchParams.id}`
                : '/api/contracts';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    selectedClauses: data.selectedClauses.map((clause) => ({
                        ...clause,
                        createdAt: new Date(clause.createdAt).toISOString(),
                        updatedAt: new Date(clause.updatedAt).toISOString(),
                    })),
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de la sauvegarde');
            }

            toast({
                title: 'Succès',
                description: isEditing ? 'Contrat mis à jour' : 'Contrat créé',
                variant: 'success',
            });

            await router.push('/dashboard/contracts');
            router.refresh();
        } catch (error) {
            console.error('Erreur complète:', error);
            toast({
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Une erreur est survenue',
                variant: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Ajout de la fonction pour gérer la sélection des clauses
    const handleClauseSelect = (clause: Clause) => {
        setValue('selectedClauses', [
            ...watch('selectedClauses'),
            {
                ...clause,
                order: watch('selectedClauses').length,
                createdAt: clause.createdAt.toISOString(),
                updatedAt: clause.updatedAt.toISOString(),
            },
        ]);
    };

    if (isInitialLoading) {
        return (
            <PageTransition>
                <div className='container mx-auto p-4 max-w-4xl'>
                    <ContractFormSkeleton />
                </div>
            </PageTransition>
        );
    }

    if (errors.type || errors.startDate || errors.employeeId) {
        return (
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded'>
                    {errors.type?.message ||
                        errors.startDate?.message ||
                        errors.employeeId?.message}
                </div>
                <Button
                    variant='outline'
                    onClick={() => router.push('/dashboard/contracts')}
                    className='mt-4'
                >
                    Retour
                </Button>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>
                        {isEditing
                            ? 'Modifier le contrat'
                            : 'Créer un nouveau contrat'}
                    </h1>
                    <Button
                        variant='outline'
                        onClick={() => router.push('/dashboard/contracts')}
                    >
                        Retour
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label
                                htmlFor='type'
                                className='text-sm font-medium'
                            >
                                Type de document
                            </label>
                            <Controller
                                name='type'
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder='Sélectionner' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    DOCUMENT_TYPES
                                                ).map(([key, value]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={value}
                                                    >
                                                        {
                                                            DOCUMENT_TYPES_LABELS[
                                                                value as keyof typeof DOCUMENT_TYPES_LABELS
                                                            ]
                                                        }
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {error && (
                                            <p className='text-sm text-red-500'>
                                                {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='employeeId'
                                className='text-sm font-medium'
                            >
                                Employé
                            </label>
                            <Select
                                value={watch('employeeId')}
                                onValueChange={(value) =>
                                    setValue('employeeId', value)
                                }
                                disabled={!!searchParams.employeeId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Sélectionner un employé' />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map((employee) => (
                                        <SelectItem
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.lastName}{' '}
                                            {employee.firstName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='startDate'
                                className='text-sm font-medium'
                            >
                                Date de début
                            </label>
                            <Input
                                id='startDate'
                                type='date'
                                {...register('startDate')}
                                required
                            />
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='endDate'
                                className='text-sm font-medium'
                            >
                                Date de fin
                            </label>
                            <Input
                                id='endDate'
                                type='date'
                                {...register('endDate')}
                            />
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <h3 className='text-lg font-medium'>
                                Clauses du contrat
                            </h3>
                            <ClauseSelector
                                availableClauses={availableClauses}
                                selectedClauses={watch('selectedClauses').map(
                                    (clause) => ({
                                        ...clause,
                                        createdAt: new Date(clause.createdAt),
                                        updatedAt: new Date(clause.updatedAt),
                                    })
                                )}
                                onSelect={handleClauseSelect}
                            />
                        </div>

                        {watch('selectedClauses').length === 0 ? (
                            <div className='text-center p-8 border border-dashed rounded-lg'>
                                <p className='text-muted-foreground'>
                                    Aucune clause n&apos;a été ajoutée à ce
                                    contrat.
                                </p>
                            </div>
                        ) : (
                            <DraggableList
                                items={watch('selectedClauses').map(
                                    (clause) => ({
                                        ...clause,
                                        createdAt: new Date(clause.createdAt),
                                        updatedAt: new Date(clause.updatedAt),
                                    })
                                )}
                                setItems={(newClauses) => {
                                    setValue(
                                        'selectedClauses',
                                        newClauses.map((clause) => ({
                                            ...clause,
                                            order: clause.order,
                                            createdAt:
                                                clause.createdAt.toISOString(),
                                            updatedAt:
                                                clause.updatedAt.toISOString(),
                                        }))
                                    );
                                }}
                                onEdit={() => {}}
                                onDelete={(clause) => {
                                    setValue(
                                        'selectedClauses',
                                        watch('selectedClauses')
                                            .filter((c) => c.id !== clause.id)
                                            .map((c, index) => ({
                                                ...c,
                                                order: index,
                                            }))
                                    );
                                }}
                                isFormContext={true}
                                preventRefresh={true}
                            />
                        )}
                    </div>

                    <div className='flex justify-end space-x-4'>
                        <Button
                            variant='outline'
                            onClick={() => router.push('/dashboard/contracts')}
                            type='button'
                        >
                            Annuler
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    {isEditing
                                        ? 'Mise à jour...'
                                        : 'Création...'}
                                </>
                            ) : isEditing ? (
                                'Mettre à jour'
                            ) : (
                                'Créer'
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
};

export default ContractForm;
