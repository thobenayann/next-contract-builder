import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteEmployeeWithContractDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isLoading?: boolean;
}

export const DeleteEmployeeWithContractDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    isLoading = false,
}: DeleteEmployeeWithContractDialogProps) => {
    return (
        <ResponsiveDialog
            isOpen={isOpen}
            onClose={onClose}
            title={`Attention : ${title} a un contrat actif`}
            description='La suppression de cet employé entraînera également la suppression de son contrat et de toutes les clauses associées. Cette action est irréversible.'
        >
            <div className='mt-4 space-x-2 flex justify-end'>
                <Button
                    variant='outline'
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Annuler
                </Button>
                <Button
                    variant='destructive'
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading && (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Supprimer
                </Button>
            </div>
        </ResponsiveDialog>
    );
};
