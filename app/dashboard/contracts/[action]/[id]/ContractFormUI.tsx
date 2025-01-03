'use client';

import { ContractFormUIProps } from '@/app/_lib/types';
import { PageTransition } from '@/components/ui/transition';
import { FormProvider } from 'react-hook-form';
import { ClausesSection } from './ClausesSection';
import { SalaryInformationSection } from './components/SalaryInformationSection';
import { FormActions } from './FormActions';
import { FormFields } from './FormFields';
import { FormHeader } from './FormHeader';

export const ContractFormUI = ({
    form,
    isViewMode,
    isEditing,
    isSubmitting,
    onSubmit,
    availableClauses,
    employees,
    contractId,
}: ContractFormUIProps) => {
    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'
                    >
                        <FormHeader
                            isViewMode={isViewMode}
                            isEditing={isEditing}
                            contractId={contractId}
                        />

                        <FormFields
                            isViewMode={isViewMode}
                            employees={employees}
                        />

                        <SalaryInformationSection isViewMode={isViewMode} />

                        <ClausesSection
                            isViewMode={isViewMode}
                            availableClauses={availableClauses}
                        />

                        <FormActions
                            isViewMode={isViewMode}
                            isEditing={isEditing}
                            isSubmitting={isSubmitting}
                        />
                    </form>
                </FormProvider>
            </div>
        </PageTransition>
    );
};
