import { LoadingBar } from '@/components/ui/loading-bar';
import { Suspense } from 'react';

const Template = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Suspense>
                <LoadingBar />
            </Suspense>
            {children}
        </>
    );
};

export default Template;
