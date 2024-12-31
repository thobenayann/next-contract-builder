import ContractForm from '../../[action]/[id]/page';

const CreateContractPage = async ({ params }: { params: { id: string } }) => {
    const resolvedParams = await params;
    const resolvedId = resolvedParams.id;

    return (
        <ContractForm
            params={{ action: 'create' }}
            searchParams={{ employeeId: resolvedId }}
        />
    );
};

export default CreateContractPage;
