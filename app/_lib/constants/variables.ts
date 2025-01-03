export const CONTRACT_VARIABLES = {
    EMPLOYEE_FIRST_NAME: '{{employee.firstName}}',
    EMPLOYEE_LAST_NAME: '{{employee.lastName}}',
    EMPLOYEE_FULL_NAME: '{{employee.fullName}}',
    MONTHLY_SALARY: '{{contract.monthlySalary}}',
    ANNUAL_SALARY: '{{contract.annualSalary}}',
    JOB_TITLE: '{{contract.jobTitle}}',
    START_DATE: '{{contract.startDate}}',
} as const;

export const VARIABLE_LABELS: Record<string, string> = {
    'employee.firstName': 'Prénom',
    'employee.lastName': 'Nom',
    'employee.fullName': 'Nom complet',
    'contract.monthlySalary': 'Salaire mensuel',
    'contract.annualSalary': 'Salaire annuel',
    'contract.jobTitle': 'Intitulé du poste',
    'contract.startDate': 'Date de début',
};
