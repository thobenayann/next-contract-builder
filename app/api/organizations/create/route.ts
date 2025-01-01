import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.user?.id) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const { name, slug } = await request.json();

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Données manquantes' },
                { status: 400 }
            );
        }

        // Transaction pour créer l'organisation et mettre à jour la session
        const result = await prisma.$transaction(async (tx) => {
            // Créer l'organisation
            const organization = await tx.organization.create({
                data: {
                    name,
                    slug,
                    members: {
                        create: {
                            userId: sessionData.user.id,
                            role: 'owner',
                        },
                    },
                },
            });

            // Mettre à jour l'utilisateur
            await tx.user.update({
                where: { id: sessionData.user.id },
                data: { activeOrganizationId: organization.id },
            });

            // Mettre à jour la session active si elle existe
            if (sessionData.session?.id) {
                await tx.session.update({
                    where: { id: sessionData.session.id },
                    data: { activeOrganizationId: organization.id },
                });
            }

            return organization;
        });

        return NextResponse.json({ organization: result });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
