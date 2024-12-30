import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(null, { status: 401 });
        }

        const { name, slug } = await request.json();

        // Transaction pour créer l'organisation et mettre à jour la session
        const result = await prisma.$transaction(async (tx) => {
            // Créer l'organisation
            const organization = await tx.organization.create({
                data: {
                    name,
                    slug,
                    members: {
                        create: {
                            userId: sessionData.session.userId,
                            role: 'owner',
                        },
                    },
                },
            });

            // Mettre à jour la session
            await tx.session.update({
                where: { id: sessionData.session.id },
                data: { activeOrganizationId: organization.id },
            });

            // Mettre à jour l'utilisateur
            await tx.user.update({
                where: { id: sessionData.session.userId },
                data: { activeOrganizationId: organization.id },
            });

            return organization;
        });

        return NextResponse.json({ organization: result });
    } catch (error) {
        console.error('Error creating organization:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
