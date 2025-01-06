export const JOB_TEMPLATES = {
    CONTRACT_OPEN_DURATION: {
        default: 'trame-vide-AFELEC.docx',
    },
    CONTRACT_DETERMINED_DURATION: {
        default: 'trame-vide-AFELEC.docx',
    },
} as const;

// Liste des postes disponibles
export const AVAILABLE_JOBS = [
    'Développeur',
    'Commercial',
    'Manager',
    // Ajoutez d'autres postes ici
] as const;

export type JobTitle = (typeof AVAILABLE_JOBS)[number];
