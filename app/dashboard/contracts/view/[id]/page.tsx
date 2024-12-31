import ContractForm from '../../[action]/[id]/page';

const ViewContractPage = async ({ params }: { params: { id: string } }) => {
    const resolvedParams = await Promise.resolve(params);

    return (
        <ContractForm
            params={{ action: 'view', id: resolvedParams.id }}
            searchParams={{ employeeId: undefined }}
        />
    );
};

export default ViewContractPage;
