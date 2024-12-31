import { ContractFormSkeleton } from '@/components/skeletons/ContractFormSkeleton';
import { PageTransition } from '@/components/ui/transition';

const Loading = () => {
    return (
        <PageTransition>
            <div className='container mx-auto p-4 max-w-4xl'>
                <ContractFormSkeleton />
            </div>
        </PageTransition>
    );
};

export default Loading;
