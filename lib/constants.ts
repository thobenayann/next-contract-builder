export const DOCUMENT_TYPES = {
    CONTRACT: 'CONTRACT',
    AMENDMENT: 'AMENDMENT',
} as const;

export const DocumentTypes = {
    Contract: DOCUMENT_TYPES.CONTRACT,
    Amendment: DOCUMENT_TYPES.AMENDMENT,
} satisfies Record<string, string>;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPES_LABELS = {
    CONTRACT: 'Contrat',
    AMENDMENT: 'Avenant',
} as const;

export const GENDERS = {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
} as const;

export const GENDER_LABELS = {
    MALE: 'Homme',
    FEMALE: 'Femme',
} as const;

export const CLAUSE_CATEGORIES = {
    MANDATORY: 'MANDATORY',
    OPTIONAL: 'OPTIONAL',
} as const;

export const CLAUSE_CATEGORIES_LABELS = {
    MANDATORY: 'Obligatoire',
    OPTIONAL: 'Optionnelle',
} as const;
