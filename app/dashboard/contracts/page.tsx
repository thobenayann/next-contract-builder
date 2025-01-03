'use client';

import { useContracts } from '@/app/_lib/hooks/useContracts';
import { ContractsList } from '@/components/ContractsList';

const ContractsPage = () => {
    const { contracts, isLoading, isError } = useContracts();

    if (isLoading) return <div>Chargement...</div>;
    if (isError) return <div>Une erreur est survenue</div>;

    return (
        <div className='container mx-auto py-6'>
            <ContractsList initialContracts={contracts} />
        </div>
    );
};

export default ContractsPage;
