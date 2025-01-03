'use client';

import { GENDERS, GENDER_LABELS } from '@/app/_lib/constants';
import { useToast } from '@/app/_lib/hooks/use-toast';
import { useEmployees } from '@/app/_lib/hooks/useEmployees';
import { EmployeeWithContract } from '@/app/_lib/types';
import { EmployeeFormData, employeeSchema } from '@/app/_lib/validations';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { format, subYears } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

interface EmployeeFormProps {
    action: 'create' | 'edit';
    initialData?: EmployeeWithContract | null;
}

export const EmployeeForm = ({ action, initialData }: EmployeeFormProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const isEditing = action === 'edit';
    const { createEmployee, updateEmployee, isLoading } = useEmployees();

    const form = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData
            ? {
                  firstName: initialData.firstName,
                  lastName: initialData.lastName,
                  gender: initialData.gender as keyof typeof GENDERS,
                  birthdate: format(
                      new Date(initialData.birthdate),
                      'yyyy-MM-dd'
                  ),
                  birthPlace: initialData.birthPlace,
                  nationality: initialData.nationality,
                  ssn: initialData.ssn,
              }
            : {
                  firstName: '',
                  lastName: '',
                  gender: undefined,
                  birthdate: '',
                  birthPlace: '',
                  nationality: '',
                  ssn: '',
              },
    });

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            if (isEditing && initialData) {
                await updateEmployee({ id: initialData.id, data });
            } else {
                await createEmployee(data);
            }
            router.push('/dashboard/employees');
        } catch (error: any) {
            toast({
                title: 'Erreur',
                description: error.message || 'Une erreur est survenue',
                variant: 'error',
            });
        }
    };

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
                                max={format(
                                    subYears(new Date(), 18),
                                    'yyyy-MM-dd'
                                )}
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
                                htmlFor='birthPlace'
                                className='text-sm font-medium'
                            >
                                Lieu de naissance
                            </label>
                            <Input
                                id='birthPlace'
                                {...form.register('birthPlace')}
                                disabled={isLoading}
                            />
                            {form.formState.errors.birthPlace && (
                                <p className='text-sm text-red-500'>
                                    {form.formState.errors.birthPlace.message}
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
                            {isEditing ? 'Modifier' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </div>
        </PageTransition>
    );
};
