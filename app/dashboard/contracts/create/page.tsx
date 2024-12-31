import ContractForm from '../[action]/[id]/page';

const CreateContractPage = () => {
    return (
        <ContractForm
            params={{ action: 'create' }}
            searchParams={{ employeeId: undefined }}
        />
    );
};

export default CreateContractPage;
