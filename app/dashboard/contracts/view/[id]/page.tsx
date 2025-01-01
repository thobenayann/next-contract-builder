import ContractForm from '../../[action]/[id]/page';

const ViewContractPage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const resolvedParams = await Promise.resolve(params);

    return (
        <ContractForm
            params={{ action: 'view', id: resolvedParams.id }}
            searchParams={{ employeeId: undefined }}
        />
    );
};

export default ViewContractPage;
