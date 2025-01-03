import { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import BoxReveal from './box-reveal';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    isLoading?: boolean;
}

export const StatsCard = ({
    title,
    value,
    icon: Icon,
    isLoading,
}: StatsCardProps) => {
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const prevValueRef = useRef(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            setShouldAnimate(true);
            return;
        }

        if (value !== prevValueRef.current) {
            setShouldAnimate(true);
            prevValueRef.current = value;
        }
    }, [value]);

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>{title}</CardTitle>
                <Icon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
                {shouldAnimate ? (
                    <BoxReveal
                        width='100%'
                        boxColor='hsl(var(--primary))'
                        duration={0.8}
                        onAnimationComplete={() => setShouldAnimate(false)}
                    >
                        <div className='text-2xl font-bold'>
                            {new Intl.NumberFormat('fr-FR').format(value)}
                        </div>
                    </BoxReveal>
                ) : (
                    <div className='text-2xl font-bold'>
                        {new Intl.NumberFormat('fr-FR').format(value)}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
