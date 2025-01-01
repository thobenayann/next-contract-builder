import { ContractFormUIProps } from '@/app/_lib/types';
import { PageTransition } from '@/components/ui/transition';
import { FormProvider } from 'react-hook-form';
import { ClausesSection } from './ClausesSection';
import { FormActions } from './FormActions';
import { FormFields } from './FormFields';
import { FormHeader } from './FormHeader';

export const ContractFormUI = ({
    form,
    isViewMode,
    isEditing,
    onSubmit,
    availableClauses,
    employees,
    contractId,
}: ContractFormUIProps) => {
    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <FormHeader
                    isViewMode={isViewMode}
                    isEditing={isEditing}
                    contractId={contractId}
                />

                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormFields
                            isViewMode={isViewMode}
                            employees={employees}
                        />

                        <ClausesSection
                            isViewMode={isViewMode}
                            availableClauses={availableClauses}
                        />

                        <FormActions
                            isViewMode={isViewMode}
                            isEditing={isEditing}
                            isSubmitting={form.formState.isSubmitting}
                        />
                    </form>
                </FormProvider>
            </div>
        </PageTransition>
    );
};
