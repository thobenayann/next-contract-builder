import { Skeleton } from '@/components/ui/skeleton';

export const ClausesSkeleton = () => {
    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-10 w-32' />
            </div>

            <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className='flex items-center justify-between p-4 border rounded-lg'
                    >
                        <Skeleton className='h-6 w-48' />
                        <div className='flex space-x-2'>
                            <Skeleton className='h-8 w-8' />
                            <Skeleton className='h-8 w-8' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
