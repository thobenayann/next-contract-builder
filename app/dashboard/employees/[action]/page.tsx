'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, subYears } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { GENDERS, GENDER_LABELS } from '@/app/_lib/constants';
import { EmployeeFormData, employeeSchema } from '@/app/_lib/validations';
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

const EmployeeForm = () => {
    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            gender: undefined,
            birthdate: '',
            nationality: '',
            ssn: '',
        },
    });
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    // Calculer la date maximale (18 ans avant aujourd'hui)
    const maxDate = format(subYears(new Date(), 18), 'yyyy-MM-dd');

    useEffect(() => {
        const loadEmployee = async () => {
            setIsInitialLoading(false);
        };

        loadEmployee();
    }, []);

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/employees/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Gestion des erreurs de validation et autres erreurs
                if (response.status === 400) {
                    if (result.details) {
                        // Erreurs de validation Zod
                        result.details.forEach((error: any) => {
                            form.setError(error.path[0], {
                                message: error.message,
                            });
                        });
                    } else {
                        // Autres erreurs 400 (comme le numéro de sécu en doublon)
                        toast({
                            variant: 'error',
                            title: 'Erreur',
                            description: result.error,
                        });
                    }
                    return;
                }
                throw new Error(result.error || 'Une erreur est survenue');
            }

            toast({
                variant: 'success',
                title: 'Succès! 🎉',
                description: 'Employé créé avec succès',
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
                        Créer un nouvel employé
                    </h1>
                    <Button
                        variant='outline'
                        onClick={() => router.push('/dashboard/employees')}
                    >
                        Retour
                    </Button>
                </div>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
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
                                {...form.register('firstName')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.firstName && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.firstName.message}
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
                                {...form.register('lastName')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.lastName && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.lastName.message}
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
                                control={form.control}
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
                            {form.formState.errors.gender && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.gender.message}
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
                                max={maxDate}
                                {...form.register('birthdate')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.birthdate && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.birthdate.message}
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
                                {...form.register('nationality')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.nationality && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.nationality.message}
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
                                {...form.register('ssn')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.ssn && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.ssn.message}
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
                            Créer
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
};

export default EmployeeForm;
