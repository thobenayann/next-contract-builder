import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
    isViewMode: boolean;
    isEditing: boolean;
    isSubmitting: boolean;
}

export const FormActions = ({
    isViewMode,
    isEditing,
    isSubmitting,
}: FormActionsProps) => {
    if (isViewMode) return null;

    return (
        <div className='flex justify-end space-x-4'>
            <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        {isEditing ? 'Mise à jour...' : 'Création...'}
                    </>
                ) : isEditing ? (
                    'Mettre à jour'
                ) : (
                    'Créer'
                )}
            </Button>
        </div>
    );
};
