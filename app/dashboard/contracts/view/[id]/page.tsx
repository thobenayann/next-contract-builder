import ContractForm from '../../[action]/[id]/page';

const ViewContractPage = async ({ params }: { params: { id: string } }) => {
    const resolvedParams = await params;
    const resolvedId = resolvedParams.id;

    return (
        <ContractForm
            params={{ action: 'view' }}
            searchParams={{ id: resolvedId }}
        />
    );
};

export default ViewContractPage;
