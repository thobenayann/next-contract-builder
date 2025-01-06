import type { ContractWithRelations } from '@/app/_lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    AlignmentType,
    Document,
    Footer,
    Header,
    HeadingLevel,
    HorizontalPositionRelativeFrom,
    ImageRun,
    Packer,
    Paragraph,
    TextRun,
    VerticalPositionRelativeFrom,
} from 'docx';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JOB_TEMPLATES } from '../constants/templates';
import { CONTRACT_VARIABLES } from '../constants/variables';

interface TipTapContent {
    type: string;
    content?: Array<{
        type: string;
        content?: Array<{
            type: string;
            text?: string;
            marks?: Array<{
                type: string;
                attrs?: {
                    color?: string;
                    fontFamily?: string;
                    fontSize?: string;
                };
            }>;
        }>;
    }>;
}

interface FormattedParagraph {
    parts: Array<{
        text: string;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
    }>;
}

export class DocumentService {
    private static getTemplatePath(contract: ContractWithRelations): string {
        const templates =
            JOB_TEMPLATES[contract.type as keyof typeof JOB_TEMPLATES];
        return join(process.cwd(), 'private', 'templates', templates.default);
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

    private static convertTipTapToDocx(jsonContent: string): Paragraph[] {
        try {
            const content = JSON.parse(jsonContent) as TipTapContent;
            const paragraphs: Paragraph[] = [];

            content.content?.forEach((block) => {
                if (!block.content || block.content.length === 0) return;

                const runs: TextRun[] = block.content.map((inline) => {
                    const text = inline.text || '';
                    const marks = inline.marks || [];
                    const fontSize = marks.find((m) => m.type === 'fontSize')
                        ?.attrs?.fontSize;

                    return new TextRun({
                        text,
                        bold: marks.some((m) => m.type === 'bold'),
                        italics: marks.some((m) => m.type === 'italic'),
                        underline: marks.some((m) => m.type === 'underline')
                            ? { type: 'single' }
                            : undefined,
                        color: marks.find((m) => m.type === 'color')?.attrs
                            ?.color,
                        font: marks.find((m) => m.type === 'fontFamily')?.attrs
                            ?.fontFamily,
                        size: fontSize ? parseInt(fontSize) : undefined,
                    });
                });

                paragraphs.push(new Paragraph({ children: runs }));
            });

            return paragraphs;
        } catch (error) {
            console.error('Error converting TipTap to Docx:', error);
            return [new Paragraph({ text: jsonContent })];
        }
    }

    private static getImageRunIfExists(
        imagePath: string,
        options: {
            width: number;
            height: number;
            floating?: {
                horizontalPosition: {
                    relative: (typeof HorizontalPositionRelativeFrom)[keyof typeof HorizontalPositionRelativeFrom];
                    offset: number;
                };
                verticalPosition: {
                    relative: (typeof VerticalPositionRelativeFrom)[keyof typeof VerticalPositionRelativeFrom];
                    offset: number;
                };
            };
        }
    ): ImageRun | null {
        try {
            const fullPath = join(process.cwd(), 'public', imagePath);
            const imageData = readFileSync(fullPath);
            return new ImageRun({
                data: imageData,
                transformation: {
                    width: options.width,
                    height: options.height,
                },
                type: imagePath.split('.').pop()?.toLowerCase() as
                    | 'png'
                    | 'jpg',
                ...(options.floating && { floating: options.floating }),
            });
        } catch (error) {
            console.warn(`Image not found: ${imagePath}`);
            return null;
        }
    }

    static async generateContract(
        contract: ContractWithRelations
    ): Promise<Buffer> {
        try {
            const sections = contract.clauses
                .sort((a, b) => a.order - b.order)
                .flatMap((clause) => {
                    const title = new Paragraph({
                        text: clause.clause.title,
                        heading: HeadingLevel.HEADING_2,
                        spacing: {
                            before: 400,
                            after: 200,
                        },
                    });

                    const content = this.convertTipTapToDocx(
                        this.replaceVariables(clause.clause.content, contract)
                    );

                    return [title, ...content];
                });

            const header = new Header({
                children: [
                    new Paragraph({
                        children: [
                            new ImageRun({
                                data: readFileSync(
                                    join(
                                        process.cwd(),
                                        'public',
                                        'logo-retis.png'
                                    )
                                ),
                                transformation: {
                                    width: 120,
                                    height: 60,
                                },
                                type: 'png',
                            }),
                            new TextRun({
                                text: 'CRÉER & VALORISER VOS RÉSEAUX',
                                break: 1,
                                size: 16,
                                font: 'Arial',
                                color: '666666',
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { after: 200 },
                    }),
                ],
            });

            const title = new Paragraph({
                children: [
                    new TextRun({
                        text:
                            contract.type === 'CONTRACT_OPEN_DURATION'
                                ? 'CONTRAT À DURÉE INDÉTERMINÉE'
                                : 'CONTRAT À DURÉE DÉTERMINÉE',
                        color: 'FFFFFF',
                        size: 28,
                        bold: true,
                    }),
                ],
                alignment: AlignmentType.CENTER,
                shading: {
                    type: 'solid',
                    color: '4A90E2',
                },
                spacing: { before: 200, after: 200 },
            });

            const footer = new Footer({
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({ text: 'Page ', size: 16 }),
                            new TextRun({ children: ['PAGE'], size: 16 }),
                            new TextRun({ text: ' sur ', size: 16 }),
                            new TextRun({ children: ['NUMPAGES'], size: 16 }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: 'AFELEC\n',
                                bold: true,
                                size: 16,
                            }),
                            new TextRun({
                                text: '720 avenue des Terres Noires – 81370 Saint-Sulpice, France\n',
                                size: 16,
                            }),
                            new TextRun({
                                text: 'Tél. +33 (0)5 63 40 20 20 – Fax. +33 (0)5 63 40 20 21\n',
                                size: 16,
                            }),
                            new TextRun({
                                text: 'www.retis-solutions.com\n\n',
                                size: 16,
                            }),
                            new TextRun({
                                text: 'SAS au capital de 1 200 000 €\n',
                                size: 14,
                                color: '666666',
                            }),
                            new TextRun({
                                text: 'RC Castres 88 B 157 – SIRET 345 047 419 00030\n',
                                size: 14,
                                color: '666666',
                            }),
                            new TextRun({
                                text: 'APE 2712Z – N° TVA FR 76 345 047 419',
                                size: 14,
                                color: '666666',
                            }),
                        ],
                        alignment: AlignmentType.LEFT,
                    }),
                ],
            });

            const doc = new Document({
                sections: [
                    {
                        properties: {
                            page: {
                                margin: {
                                    top: 1440,
                                    right: 1440,
                                    bottom: 1440,
                                    left: 1440,
                                },
                            },
                        },
                        headers: {
                            default: header,
                        },
                        footers: {
                            default: footer,
                        },
                        children: [title, ...sections],
                    },
                ],
                styles: {
                    paragraphStyles: [
                        {
                            id: 'Heading1',
                            name: 'Heading 1',
                            run: {
                                size: 32,
                                bold: true,
                            },
                        },
                        {
                            id: 'Heading2',
                            name: 'Heading 2',
                            run: {
                                size: 28,
                                bold: true,
                            },
                        },
                    ],
                },
            });

            return await Packer.toBuffer(doc);
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }
}
