import { Skeleton } from '@/components/ui/skeleton';

export const ContractFormSkeleton = () => {
    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center mb-6'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-10 w-20' />
            </div>

            <div className='grid grid-cols-2 gap-4'>
                {/* Type et Employé */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className='space-y-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-10 w-full' />
                    </div>
                ))}
            </div>

            {/* Section Clauses */}
            <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                    <Skeleton className='h-6 w-32' />
                    <Skeleton className='h-10 w-40' />
                </div>
                <Skeleton className='h-[200px] w-full' />
            </div>

            {/* Boutons d'action */}
            <div className='flex justify-end space-x-4'>
                <Skeleton className='h-10 w-24' />
                <Skeleton className='h-10 w-24' />
            </div>
        </div>
    );
};
