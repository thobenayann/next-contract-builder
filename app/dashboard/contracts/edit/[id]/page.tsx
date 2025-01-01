import ContractForm from '../../[action]/[id]/page';

const EditContractPage = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const resolvedParams = await Promise.resolve(params);

    return (
        <ContractForm
            params={{ action: 'edit', id: resolvedParams.id }}
            searchParams={{ employeeId: undefined }}
        />
    );
};

export default EditContractPage;
