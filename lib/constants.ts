export const DOCUMENT_TYPES = {
    CONTRACT: 'CONTRACT',
    AMENDMENT: 'AMENDMENT',
} as const;

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

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];
export type ClauseCategory =
    (typeof CLAUSE_CATEGORIES)[keyof typeof CLAUSE_CATEGORIES];
