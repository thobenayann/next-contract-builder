import { Skeleton } from '@/components/ui/skeleton';

export const EmployeesSkeleton = () => {
    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-10 w-32' />
            </div>

            <div className='border rounded-lg'>
                <div className='divide-y'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className='p-4 flex items-center justify-between'
                        >
                            <div className='flex space-x-4'>
                                <Skeleton className='h-6 w-32' />
                                <Skeleton className='h-6 w-24' />
                                <Skeleton className='h-6 w-32' />
                            </div>
                            <div className='flex space-x-2'>
                                <Skeleton className='h-8 w-8' />
                                <Skeleton className='h-8 w-8' />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
