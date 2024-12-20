import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    isLoading: boolean;
}

export const DeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    isLoading,
}: DeleteConfirmDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer la clause &quot;
                        {title}&quot; ? Cette action est irréversible.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
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
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Suppression en cours...
                            </>
                        ) : (
                            'Supprimer'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
