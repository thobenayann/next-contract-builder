import { prisma } from '@/app/_lib/db';
import { getSession } from '@/app/_lib/session';
import { ContractsList } from '@/components/ContractsList';

const ContractsPage = async () => {
    const session = await getSession();
    if (!session?.userId) return null;

    // Récupérer l'utilisateur avec son organisation active
    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            activeOrganization: true,
        },
    });

    if (!user?.activeOrganization) return null;

    // Récupérer les contrats de l'organisation active
    const contracts = await prisma.contract.findMany({
        where: {
            organizationId: user.activeOrganization.id,
        },
        include: {
            employee: true,
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const formattedContracts = contracts.map((contract) => ({
        ...contract,
        startDate: contract.startDate.toISOString(),
        endDate: contract.endDate?.toISOString() || null,
        isOwner: contract.userId === session.userId,
        authorName: contract.user.name || 'Utilisateur inconnu',
        user: undefined,
    }));

    return (
        <div className='container mx-auto py-6'>
            <ContractsList initialContracts={formattedContracts} />
        </div>
    );
};

export default ContractsPage;
