'use client';

import { use, useEffect, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { EmployeeFormSkeleton } from '@/components/skeletons/EmployeeFormSkeleton';
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
import { GENDERS, GENDER_LABELS } from '@/lib/constants';
import { employeeResolver, type EmployeeFormData } from '@/lib/validations';

const EmployeeForm = (props: {
    params: Promise<{ action: string }>;
    searchParams: Promise<{ id?: string }>;
}) => {
    const searchParams = use(props.searchParams);
    const params = use(props.params);
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        control,
        reset,
    } = useForm<EmployeeFormData>({
        resolver: employeeResolver,
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: undefined,
            birthdate: '',
            nationality: '',
            ssn: '',
        },
    });
    const isEditing = params.action === 'edit';

    useEffect(() => {
        if (isEditing && searchParams.id) {
            setIsLoading(true);
            fetch(`/api/employees/${searchParams.id}`)
                .then(async (res) => {
                    if (!res.ok) throw new Error('Employé non trouvé');
                    return res.json();
                })
                .then((data) => {
                    reset({
                        ...data,
                        birthdate: new Date(data.birthdate)
                            .toISOString()
                            .split('T')[0],
                    });
                })
                .catch((err) => {
                    console.error('Erreur lors du chargement:', err);
                    toast({
                        variant: 'error',
                        title: 'Erreur',
                        description: err.message || 'Erreur lors du chargement',
                    });
                    router.push('/dashboard/employees');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsInitialLoading(false);
        }
    }, [isEditing, searchParams.id, reset, router, toast]);

    const onSubmit = async (data: EmployeeFormData) => {
        setIsLoading(true);

        try {
            const url = isEditing
                ? `/api/employees/${searchParams.id}`
                : '/api/employees';
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
                            setError(issue.path[0] as keyof EmployeeFormData, {
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
                    ? 'Employé modifié avec succès'
                    : 'Employé créé avec succès',
            });

            router.push('/dashboard/employees');
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

    if (isInitialLoading) {
        return (
            <PageTransition>
                <div className='container mx-auto p-4 max-w-4xl'>
                    <EmployeeFormSkeleton />
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold'>
                        {isEditing
                            ? "Modifier l'employé"
                            : 'Créer un nouvel employé'}
                    </h1>
                    <Button
                        variant='outline'
                        onClick={() => router.push('/dashboard/employees')}
                    >
                        Retour
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                            <label
                                htmlFor='firstName'
                                className='text-sm font-medium'
                            >
                                Prénom
                            </label>
                            <Input
                                id='firstName'
                                {...register('firstName')}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <p className='text-sm text-red-500'>
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='lastName'
                                className='text-sm font-medium'
                            >
                                Nom
                            </label>
                            <Input
                                id='lastName'
                                {...register('lastName')}
                                disabled={isLoading}
                            />
                            {errors.lastName && (
                                <p className='text-sm text-red-500'>
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='gender'
                                className='text-sm font-medium'
                            >
                                Genre
                            </label>
                            <Controller
                                name='gender'
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder='Sélectionner' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(GENDERS).map(
                                                ([key, value]) => (
                                                    <SelectItem
                                                        key={key}
                                                        value={value}
                                                    >
                                                        {
                                                            GENDER_LABELS[
                                                                value as keyof typeof GENDER_LABELS
                                                            ]
                                                        }
                                                    </SelectItem>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.gender && (
                                <p className='text-sm text-red-500'>
                                    {errors.gender.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='birthdate'
                                className='text-sm font-medium'
                            >
                                Date de naissance
                            </label>
                            <Input
                                id='birthdate'
                                type='date'
                                {...register('birthdate')}
                                disabled={isLoading}
                            />
                            {errors.birthdate && (
                                <p className='text-sm text-red-500'>
                                    {errors.birthdate.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='nationality'
                                className='text-sm font-medium'
                            >
                                Nationalité
                            </label>
                            <Input
                                id='nationality'
                                {...register('nationality')}
                                disabled={isLoading}
                            />
                            {errors.nationality && (
                                <p className='text-sm text-red-500'>
                                    {errors.nationality.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='ssn'
                                className='text-sm font-medium'
                            >
                                Numéro de sécurité sociale
                            </label>
                            <Input
                                id='ssn'
                                {...register('ssn')}
                                disabled={isLoading}
                            />
                            {errors.ssn && (
                                <p className='text-sm text-red-500'>
                                    {errors.ssn.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end space-x-4'>
                        <Button
                            variant='outline'
                            onClick={() => router.push('/dashboard/employees')}
                            type='button'
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button type='submit' disabled={isLoading}>
                            {isLoading && (
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            )}
                            {isEditing ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
};

export default EmployeeForm;
