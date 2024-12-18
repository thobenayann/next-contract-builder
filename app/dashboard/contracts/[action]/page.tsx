'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageTransition } from '@/components/ui/transition';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DOCUMENT_TYPES, DOCUMENT_TYPES_LABELS } from '@/lib/constants';
import { DraggableList } from '@/components/DraggableList';
import type { Clause } from '@prisma/client';
import { ClauseSelector } from '@/components/ClauseSelector';
import { Controller, useForm } from 'react-hook-form';
import { contractResolver, type ContractFormData } from '@/lib/validations';
import { useToast } from '@/hooks/use-toast';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
}

interface AvailableClause extends Clause {
    isSelected?: boolean;
}

export default function ContractForm(
    props: {
        params: Promise<{ action: string }>;
        searchParams: Promise<{ id?: string; employeeId?: string }>;
    }
) {
    const searchParams = use(props.searchParams);
    const params = use(props.params);
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
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

    // Charger les clauses et les employés disponibles
    useEffect(() => {
        Promise.all([
            fetch('/api/clauses').then((res) => res.json()),
            fetch('/api/employees').then((res) => res.json()),
        ])
            .then(([clauses, employees]) => {
                setAvailableClauses(
                    clauses.map((clause: Clause) => ({
                        ...clause,
                        category: clause.category || 'OPTIONAL',
                        createdAt: new Date(clause.createdAt),
                        updatedAt: new Date(clause.updatedAt),
                    }))
                );
                setEmployees(employees);
            })
            .catch((error) => {
                console.error('Erreur lors du chargement des données:', error);
                setError('root', {
                    type: 'manual',
                    message: 'Erreur lors du chargement des données',
                });
            });
    }, [setError]);

    // Charger les données du contrat en mode édition
    useEffect(() => {
        if (isEditing && searchParams.id) {
            setIsLoading(true);
            fetch(`/api/contracts/${searchParams.id}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Contrat non trouvé');
                    return res.json();
                })
                .then((data) => {
                    setValue('type', data.type);
                    setValue(
                        'startDate',
                        new Date(data.startDate).toISOString().split('T')[0]
                    );
                    setValue(
                        'endDate',
                        data.endDate
                            ? new Date(data.endDate).toISOString().split('T')[0]
                            : undefined
                    );
                    setValue('employeeId', data.employeeId);
                    setValue(
                        'selectedClauses',
                        data.clauses.map((c: { clause: Clause }) => ({
                            ...c.clause,
                            category: c.clause.category || 'OPTIONAL',
                            createdAt: new Date(c.clause.createdAt),
                            updatedAt: new Date(c.clause.updatedAt),
                        }))
                    );
                })
                .catch((err) => {
                    console.error('Erreur lors du chargement:', err);
                    setError('root', {
                        type: 'manual',
                        message: err.message || 'Erreur lors du chargement',
                    });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isEditing, searchParams.id, setValue, setError]);

    const onSubmit = async (data: ContractFormData) => {
        setIsLoading(true);

        try {
            const url = isEditing
                ? `/api/contracts/${searchParams.id}`
                : '/api/contracts';
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.issues) {
                    result.issues.forEach(
                        (issue: { path: string[]; message: string }) => {
                            setError(issue.path[0] as keyof ContractFormData, {
                                message: issue.message,
                            });
                        }
                    );
                    return;
                }

                throw new Error(result.error || 'Une erreur est survenue');
            }

            toast({
                variant: 'success',
                title: 'Succès',
                description: isEditing
                    ? 'Contrat modifié avec succès'
                    : 'Contrat créé avec succès',
            });

            router.push('/dashboard/contracts');
            router.refresh();
        } catch (error) {
            console.error('Erreur:', error);
            toast({
                variant: 'error',
                title: 'Erreur',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Une erreur est survenue',
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Ajout de la fonction pour gérer la sélection des clauses
    const handleClauseSelect = (clause: Clause) => {
        setValue('selectedClauses', [
            ...watch('selectedClauses'),
            {
                ...clause,
                order: watch('selectedClauses').length,
            },
        ]);
    };

    if (errors.type || errors.startDate || errors.employeeId) {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {errors.type?.message ||
                        errors.startDate?.message ||
                        errors.employeeId?.message}
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard/contracts')}
                    className="mt-4"
                >
                    Retour
                </Button>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        {isEditing
                            ? 'Modifier le contrat'
                            : 'Créer un nouveau contrat'}
                    </h1>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/dashboard/contracts')}
                    >
                        Retour
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="type"
                                className="text-sm font-medium"
                            >
                                Type de document
                            </label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field, fieldState: { error } }) => (
                                    <>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={isLoading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner" />
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
                                            <p className="text-sm text-red-500">
                                                {error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="employeeId"
                                className="text-sm font-medium"
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
                                    <SelectValue placeholder="Sélectionner un employé" />
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

                        <div className="space-y-2">
                            <label
                                htmlFor="startDate"
                                className="text-sm font-medium"
                            >
                                Date de début
                            </label>
                            <Input
                                id="startDate"
                                type="date"
                                {...register('startDate')}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="endDate"
                                className="text-sm font-medium"
                            >
                                Date de fin
                            </label>
                            <Input
                                id="endDate"
                                type="date"
                                {...register('endDate')}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                Clauses du contrat
                            </h3>
                            <ClauseSelector
                                availableClauses={availableClauses}
                                selectedClauses={watch('selectedClauses')}
                                onSelect={handleClauseSelect}
                            />
                        </div>

                        {watch('selectedClauses').length === 0 ? (
                            <div className="text-center p-8 border border-dashed rounded-lg">
                                <p className="text-muted-foreground">
                                    Aucune clause n&apos;a été ajoutée à ce
                                    contrat.
                                </p>
                            </div>
                        ) : (
                            <DraggableList
                                items={watch('selectedClauses')}
                                setItems={(newClauses) => {
                                    setValue(
                                        'selectedClauses',
                                        newClauses.map((clause, index) => ({
                                            ...clause,
                                            order: index,
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
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/dashboard/contracts')}
                            type="button"
                        >
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEditing ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
}
