import ContractForm from '../../[action]/[id]/page';

const EditContractPage = async ({ params }: { params: { id: string } }) => {
    const resolvedParams = await params;
    const resolvedId = resolvedParams.id;

    return (
        <ContractForm
            params={{ action: 'edit' }}
            searchParams={{ id: resolvedId }}
        />
    );
};

export default EditContractPage;
