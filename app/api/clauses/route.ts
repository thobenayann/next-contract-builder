import { NextResponse } from 'next/server';

import { CLAUSE_CATEGORIES } from '@/lib/constants';
import { prisma } from '@/lib/db';

export const fetchCache = 'default-cache';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const { title, content } = await request.json();
        const lastClause = await prisma.clause.findFirst({
            orderBy: { order: 'desc' },
        });

        const newClause = await prisma.clause.create({
            data: {
                title,
                content,
                category: CLAUSE_CATEGORIES.OPTIONAL,
                order: lastClause ? lastClause.order + 1 : 0,
            },
        });

        return NextResponse.json(newClause);
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const clauses = await prisma.clause.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(clauses);
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}
