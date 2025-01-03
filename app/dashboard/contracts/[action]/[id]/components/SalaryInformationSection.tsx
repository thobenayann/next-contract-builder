'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface SalaryInformationSectionProps {
    isViewMode: boolean;
}

export const SalaryInformationSection = ({
    isViewMode,
}: SalaryInformationSectionProps) => {
    const { register } = useFormContext();

    return (
        <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Informations salariales</h3>
            <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Classification
                    </label>
                    <Input
                        {...register('classification')}
                        className='w-full'
                        disabled={isViewMode}
                        maxLength={2}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Rattachement hiérarchique
                    </label>
                    <Input
                        {...register('hierarchicalReport')}
                        className='w-full'
                        disabled={isViewMode}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Période d&apos;essai (mois)
                    </label>
                    <Input
                        type='number'
                        {...register('trialPeriod', { valueAsNumber: true })}
                        className='w-full'
                        disabled={isViewMode}
                        min={1}
                        max={12}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Renouvellement période d&apos;essai (mois)
                    </label>
                    <Input
                        type='number'
                        {...register('trialPeriodRenewal', {
                            valueAsNumber: true,
                        })}
                        className='w-full'
                        disabled={isViewMode}
                        min={1}
                        max={12}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Salaire mensuel brut (€)
                    </label>
                    <Input
                        type='number'
                        {...register('monthlySalary', { valueAsNumber: true })}
                        className='w-full'
                        disabled={isViewMode}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Salaire annuel brut (€)
                    </label>
                    <Input
                        type='number'
                        {...register('annualSalary', { valueAsNumber: true })}
                        className='w-full'
                        disabled={isViewMode}
                    />
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>
                        Prime variable (€)
                    </label>
                    <Input
                        type='number'
                        {...register('variableBonus', { valueAsNumber: true })}
                        className='w-full'
                        disabled={isViewMode}
                    />
                </div>

                <div className='flex items-center space-x-2 pt-8'>
                    <Checkbox
                        id='companyVehicle'
                        {...register('companyVehicle')}
                        disabled={isViewMode}
                    />
                    <label
                        htmlFor='companyVehicle'
                        className='text-sm font-medium leading-none'
                    >
                        Véhicule de fonction
                    </label>
                </div>
            </div>
        </div>
    );
};
