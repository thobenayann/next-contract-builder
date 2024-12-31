import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface FormHeaderProps {
    isViewMode: boolean;
    isEditing: boolean;
    contractId?: string;
}

export const FormHeader = ({
    isViewMode,
    isEditing,
    contractId,
}: FormHeaderProps) => {
    const router = useRouter();

    return (
        <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>
                {isViewMode
                    ? 'Détails du contrat'
                    : isEditing
                    ? 'Modifier le contrat'
                    : 'Créer un nouveau contrat'}
            </h1>
            <div className='space-x-4'>
                {isViewMode && contractId && (
                    <Button
                        onClick={() =>
                            router.push(
                                `/dashboard/contracts/edit/${contractId}`
                            )
                        }
                    >
                        Modifier
                    </Button>
                )}
                <Button
                    variant='outline'
                    onClick={() => router.push('/dashboard/contracts')}
                >
                    Retour
                </Button>
            </div>
        </div>
    );
};
