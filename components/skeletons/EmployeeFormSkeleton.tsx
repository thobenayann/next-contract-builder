import { Skeleton } from '@/components/ui/skeleton';

export const EmployeeFormSkeleton = () => {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center mb-6'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-10 w-20' />
            </div>

            <div className='grid grid-cols-2 gap-4'>
                {/* Champs du formulaire */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className='space-y-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-10 w-full' />
                    </div>
                ))}
            </div>

            {/* Boutons d'action */}
            <div className='flex justify-end space-x-4'>
                <Skeleton className='h-10 w-24' />
                <Skeleton className='h-10 w-24' />
            </div>
        </div>
    );
};
