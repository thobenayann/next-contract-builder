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

        const { organizationId } = await request.json();

        // Transaction pour mettre à jour la session et l'utilisateur
        await prisma.$transaction(async (tx) => {
            await tx.session.update({
                where: { id: sessionData.session.id },
                data: { activeOrganizationId: organizationId },
            });

            await tx.user.update({
                where: { id: sessionData.session.userId },
                data: { activeOrganizationId: organizationId },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting active organization:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
