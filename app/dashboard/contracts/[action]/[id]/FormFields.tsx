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

    return (
        <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
                <label htmlFor='type' className='text-sm font-medium'>
                    Type de document
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
                                        <SelectItem key={key} value={value}>
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
                <label htmlFor='employeeId' className='text-sm font-medium'>
                    Employé
                </label>
                <Select
                    value={watch('employeeId')}
                    onValueChange={(value) => setValue('employeeId', value)}
                    disabled={isViewMode}
                >
                    <SelectTrigger>
                        <SelectValue placeholder='Sélectionner un employé' />
                    </SelectTrigger>
                    <SelectContent>
                        {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                                {employee.lastName} {employee.firstName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className='space-y-2'>
                <label htmlFor='startDate' className='text-sm font-medium'>
                    Date de début
                </label>
                <Input
                    id='startDate'
                    type='date'
                    {...register('startDate')}
                    disabled={isViewMode}
                    required
                />
            </div>

            <div className='space-y-2'>
                <label htmlFor='endDate' className='text-sm font-medium'>
                    Date de fin
                </label>
                <Input
                    id='endDate'
                    type='date'
                    {...register('endDate')}
                    disabled={isViewMode}
                />
            </div>
        </div>
    );
};
