import { auth } from '@/app/_lib/auth';
import { prisma } from '@/app/_lib/db';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sessionData = await auth.api.getSession({
            headers: await headers(),
        });

        if (!sessionData?.session?.userId) {
            return NextResponse.json(null, { status: 401 });
        }

        const { session } = sessionData;

        const [activeOrg, organizations] = await Promise.all([
            session.activeOrganizationId
                ? prisma.organization.findFirst({
                      where: {
                          id: session.activeOrganizationId,
                          members: {
                              some: { userId: session.userId },
                          },
                      },
                  })
                : null,
            prisma.organization.findMany({
                where: {
                    members: {
                        some: { userId: session.userId },
                    },
                },
            }),
        ]);

        return NextResponse.json({ activeOrg, organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
