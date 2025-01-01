import ContractForm from '../../[action]/[id]/page';

const CreateContractPage = async (props: {
    params: Promise<{ id: string }>;
}) => {
    const params = await props.params;
    const resolvedId = params.id;

    return (
        <ContractForm
            params={{ action: 'create' }}
            searchParams={{ employeeId: resolvedId }}
        />
    );
};

export default CreateContractPage;
