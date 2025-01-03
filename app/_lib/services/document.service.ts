import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TextRun,
} from 'docx';

import type { ContractWithRelations } from '@/app/_lib/types';
import type { Clause } from '@prisma/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CONTRACT_VARIABLES } from '../constants/variables';

interface TipTapContent {
    type: string;
    content?: Array<{
        type: string;
        content?: Array<{
            type: string;
            text?: string;
            marks?: Array<{ type: string }>;
        }>;
    }>;
}

export class DocumentService {
    private static parseContent(jsonContent: string): string {
        try {
            const content = JSON.parse(jsonContent) as TipTapContent;
            return (
                content.content
                    ?.map((block) =>
                        block.content
                            ?.map((inline) => inline.text)
                            .filter(Boolean)
                            .join(' ')
                    )
                    .filter(Boolean)
                    .join('\n\n') || ''
            );
        } catch {
            return jsonContent;
        }
    }

    private static replaceVariables(
        content: string,
        contract: ContractWithRelations
    ): string {
        const replacements = {
            [CONTRACT_VARIABLES.EMPLOYEE_FIRST_NAME]:
                contract.employee.firstName,
            [CONTRACT_VARIABLES.EMPLOYEE_LAST_NAME]: contract.employee.lastName,
            [CONTRACT_VARIABLES.EMPLOYEE_FULL_NAME]: `${contract.employee.firstName} ${contract.employee.lastName}`,
            [CONTRACT_VARIABLES.MONTHLY_SALARY]:
                contract.monthlySalary.toString(),
            [CONTRACT_VARIABLES.ANNUAL_SALARY]:
                contract.annualSalary?.toString() || '',
            [CONTRACT_VARIABLES.JOB_TITLE]: contract.jobTitle,
            [CONTRACT_VARIABLES.START_DATE]: format(
                new Date(contract.startDate),
                'dd MMMM yyyy',
                { locale: fr }
            ),
        };

        return Object.entries(replacements).reduce(
            (text, [variable, value]) => text.replaceAll(variable, value),
            content
        );
    }

    static async generateContract(
        contract: ContractWithRelations
    ): Promise<Buffer> {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: 'CONTRAT DE TRAVAIL',
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 400, after: 400 },
                        }),

                        new Paragraph({
                            text: 'Entre les soussignés :',
                            spacing: { before: 200, after: 200 },
                        }),

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${contract.employee.lastName} ${contract.employee.firstName}`,
                                    bold: true,
                                }),
                            ],
                            spacing: { before: 200, after: 400 },
                        }),

                        ...contract.clauses.flatMap(
                            ({ clause }: { clause: Clause }) => [
                                new Paragraph({
                                    text: clause.title,
                                    heading: HeadingLevel.HEADING_2,
                                    spacing: { before: 400, after: 200 },
                                }),
                                new Paragraph({
                                    text: this.replaceVariables(
                                        this.parseContent(clause.content),
                                        contract
                                    ),
                                    spacing: { after: 200 },
                                }),
                            ]
                        ),
                    ],
                },
            ],
        });

        return await Packer.toBuffer(doc);
    }
}
