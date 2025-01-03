import { z } from 'zod';

const clauseSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    category: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string(),
});

export const contractSchema = z.object({
    type: z.string().min(1, 'Le type est requis'),
    startDate: z.string().min(1, 'La date de début est requise'),
    endDate: z.string().nullable(),
    employeeId: z.string().min(1, "L'employé est requis"),
    jobTitle: z.string().min(1, "L'intitulé du poste est requis"),
    classification: z
        .string()
        .length(2, 'La classification doit contenir 2 caractères'),
    hierarchicalReport: z
        .string()
        .min(1, 'Le rattachement hiérarchique est requis'),
    monthlySalary: z.number().min(0, 'Le salaire mensuel doit être positif'),
    annualSalary: z
        .number()
        .min(0, 'Le salaire annuel doit être positif')
        .nullable(),
    variableBonus: z
        .number()
        .min(0, 'La prime variable doit être positive')
        .nullable(),
    companyVehicle: z.boolean().default(false),
    trialPeriod: z
        .number()
        .min(1, "La période d'essai doit être d'au moins 1 mois")
        .max(12),
    trialPeriodRenewal: z.number().min(1).max(12).nullable(),
    selectedClauses: z
        .array(clauseSchema)
        .min(1, 'Au moins une clause est requise'),
});

export type ContractFormData = z.infer<typeof contractSchema>;

export const defaultContractValues: ContractFormData = {
    type: 'CONTRACT',
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    employeeId: '',
    jobTitle: '',
    classification: '',
    hierarchicalReport: '',
    monthlySalary: 0,
    annualSalary: null,
    variableBonus: null,
    companyVehicle: false,
    trialPeriod: 1,
    trialPeriodRenewal: null,
    selectedClauses: [],
};
