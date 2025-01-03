'use client';

import {
    CONTRACT_VARIABLES,
    VARIABLE_LABELS,
} from '@/app/_lib/constants/variables';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface VariableSelectorProps {
    onSelect: (variable: string) => void;
}

export const VariableSelector = ({ onSelect }: VariableSelectorProps) => {
    const [value, setValue] = useState<string>('');

    const handleSelect = (selectedValue: string) => {
        onSelect(selectedValue);
        setValue(''); // Réinitialiser la valeur
    };

    return (
        <Select value={value} onValueChange={handleSelect}>
            <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Insérer une variable' />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(CONTRACT_VARIABLES).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                        {VARIABLE_LABELS[value.replace(/[{}]/g, '')]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
