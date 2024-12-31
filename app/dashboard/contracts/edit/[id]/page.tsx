import ContractForm from '../../[action]/[id]/page';

const EditContractPage = async ({ params }: { params: { id: string } }) => {
    const resolvedParams = await Promise.resolve(params);

    return (
        <ContractForm
            params={{ action: 'edit', id: resolvedParams.id }}
            searchParams={{ employeeId: undefined }}
        />
    );
};

export default EditContractPage;
