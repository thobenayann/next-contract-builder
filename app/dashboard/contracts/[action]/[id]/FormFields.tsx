'use client';

import { DOCUMENT_TYPES, DOCUMENT_TYPES_LABELS } from '@/app/_lib/constants';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Employee } from '@prisma/client';
import { Controller, useFormContext } from 'react-hook-form';

interface FormFieldsProps {
    isViewMode: boolean;
    employees: Employee[];
}

export const FormFields = ({ isViewMode, employees }: FormFieldsProps) => {
    const { control, register, watch, setValue } = useFormContext();

    // Observer le type de contrat
    const contractType = watch('type');

    // Si c'est un CDI, on vide la date de fin
    const isOpenDuration =
        contractType === DOCUMENT_TYPES.CONTRACT_OPEN_DURATION;
    if (isOpenDuration) {
        setValue('endDate', null);
    }

    return (
        <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Type de contrat
                    </label>
                    <Controller
                        name='type'
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isViewMode}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder='Sélectionner' />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(DOCUMENT_TYPES).map(
                                        ([key, value]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {
                                                    DOCUMENT_TYPES_LABELS[
                                                        value as keyof typeof DOCUMENT_TYPES_LABELS
                                                    ]
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Employé</label>
                    <Controller
                        name='employeeId'
                        control={control}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={isViewMode}
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
                        )}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Date de début</label>
                    <Input
                        type='date'
                        {...register('startDate')}
                        disabled={isViewMode}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Date de fin
                        {isOpenDuration && (
                            <span className='ml-2 text-xs text-muted-foreground'>
                                (Non applicable pour un CDI)
                            </span>
                        )}
                    </label>
                    <Input
                        type='date'
                        {...register('endDate')}
                        disabled={isViewMode || isOpenDuration}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Intitulé du poste
                    </label>
                    <Input {...register('jobTitle')} disabled={isViewMode} />
                </div>
            </div>
        </div>
    );
};
