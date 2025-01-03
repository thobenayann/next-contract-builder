export const DOCUMENT_TYPES = {
    CONTRACT_DETERMINED_DURATION: 'CONTRACT_DETERMINED_DURATION',
    CONTRACT_OPEN_DURATION: 'CONTRACT_OPEN_DURATION',
    AMENDMENT: 'AMENDMENT',
} as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPES_LABELS: Record<DocumentType, string> = {
    CONTRACT_DETERMINED_DURATION: 'Contrat à durée déterminée',
    CONTRACT_OPEN_DURATION: 'Contrat à durée indéterminée',
    AMENDMENT: 'Avenant',
};

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
