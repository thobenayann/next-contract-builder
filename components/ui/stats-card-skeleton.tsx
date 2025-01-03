import { Card, CardContent, CardHeader, CardTitle } from './card';

export const StatsCardSkeleton = () => {
    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                    <div className='h-4 bg-muted animate-pulse rounded' />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-2xl font-bold'>
                    <div className='h-8 bg-muted animate-pulse rounded w-1/3' />
                </div>
            </CardContent>
        </Card>
    );
};
