import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatSSN(ssn: string): string {
    // Supprime tous les espaces et caractères non numériques
    return ssn.replace(/[^\d]/g, '');
}

export function isValidSSN(ssn: string): boolean {
    const cleanSSN = formatSSN(ssn);
    return /^[12][0-9]{14}$/.test(cleanSSN);
}

export function formatSSNDisplay(ssn: string): string {
    const cleaned = formatSSN(ssn);
    const matches = cleaned.match(
        /^(\d{1})(\d{2})(\d{2})(\d{2})(\d{3})(\d{3})(\d{2})$/
    );

    if (matches) {
        return `${matches[1]} ${matches[2]} ${matches[3]} ${matches[4]} ${matches[5]} ${matches[6]} ${matches[7]}`;
    }

    return ssn;
}
