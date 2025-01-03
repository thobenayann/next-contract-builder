import { authClient } from '@/app/_lib/auth-client';
import { prisma } from '@/app/_lib/db';
import { SignUpInput } from '@/app/_lib/validations/schemas/auth.schema';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data: SignUpInput = await request.json();

        // 1. Vérifier si l'organisation existe déjà
        const existingOrg = await prisma.organization.findUnique({
            where: {
                slug: data.organization.name.toLowerCase().replace(/\s+/g, '-'),
            },
            include: {
                members: {
                    where: { role: 'owner' },
                    include: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        if (existingOrg) {
            const ownerEmail = existingOrg.members[0]?.user.email;
            return NextResponse.json(
                {
                    error: 'Organisation déjà existante',
                    ownerEmail,
                    code: 'ORG_EXISTS',
                },
                { status: 409 }
            );
        }

        // 2. Vérifier si l'email existe déjà
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    error: 'Un compte existe déjà avec cet email',
                    code: 'USER_EXISTS',
                },
                { status: 409 }
            );
        }

        // 3. Si tout est OK, créer l'utilisateur et l'organisation dans une transaction
        const result = await prisma.$transaction(async (tx) => {
            try {
                // Créer l'utilisateur avec auth
                const signUpResult = await authClient.signUp.email({
                    email: data.email,
                    password: data.password,
                    name: data.name,
                });

                if (!signUpResult || signUpResult.error) {
                    throw new Error(
                        signUpResult?.error?.message ||
                            "Erreur lors de la création de l'utilisateur"
                    );
                }

                // Récupérer l'utilisateur créé
                const user = await tx.user.findUnique({
                    where: { email: data.email },
                });

                if (!user) {
                    throw new Error(
                        "Erreur lors de la création de l'utilisateur"
                    );
                }

                // Créer l'organisation
                const organization = await tx.organization.create({
                    data: {
                        name: data.organization.name,
                        slug: data.organization.name
                            .toLowerCase()
                            .replace(/\s+/g, '-'),
                        members: {
                            create: {
                                userId: user.id,
                                role: 'owner',
                            },
                        },
                    },
                });

                // Mettre à jour l'utilisateur avec l'organisation active
                const updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: { activeOrganizationId: organization.id },
                });

                return {
                    user: updatedUser,
                    organization,
                };
            } catch (error) {
                console.error('Erreur dans la transaction:', error);
                throw error;
            }
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Erreur complète:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // Violation de contrainte unique
                return NextResponse.json(
                    {
                        error: 'Cette organisation existe déjà',
                        code: 'ORG_EXISTS',
                    },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            {
                error: "Une erreur est survenue lors de l'inscription",
                details: error instanceof Error ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}
