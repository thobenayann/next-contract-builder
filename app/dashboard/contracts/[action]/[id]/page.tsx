import { prisma } from '@/app/_lib/db';
import { ContractFormProps } from '@/app/_lib/types';
import { notFound } from 'next/navigation';
import ContractFormClient from './ContractFormClient';

async function getContractData(action: string, id?: string) {
    const [clauses, employees, contract] = await Promise.all([
        prisma.clause.findMany(),
        prisma.employee.findMany(),
        action === 'view' || action === 'edit'
            ? id
                ? prisma.contract.findUnique({
                      where: { id },
                      include: {
                          employee: true,
                          clauses: {
                              include: { clause: true },
                              orderBy: { order: 'asc' },
                          },
                      },
                  })
                : null
            : null,
    ]);

    if ((action === 'view' || action === 'edit') && !contract) {
        notFound();
    }

    return {
        clauses,
        employees,
        contract,
    };
}

const ContractPage = async (props: ContractFormProps) => {
    const { params, searchParams } = props;
    const id = 'id' in params ? params.id : undefined;
    const data = await getContractData(params.action, id);

    return (
        <ContractFormClient
            action={params.action}
            initialData={data}
            employeeId={searchParams.employeeId}
            contractId={id}
        />
    );
};

export default ContractPage;
