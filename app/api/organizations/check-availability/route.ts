import { prisma } from '@/app/_lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug manquant' }, { status: 400 });
    }

    try {
        const existingOrg = await prisma.organization.findUnique({
            where: { slug },
            include: {
                members: {
                    where: { role: 'owner' },
                    include: {
                        user: {
                            select: {
                                email: true,
                            },
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
                },
                { status: 409 }
            );
        }

        return NextResponse.json({ available: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la vérification' },
            { status: 500 }
        );
    }
}
