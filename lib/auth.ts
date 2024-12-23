import { auth } from '@/auth';

export async function getCurrentUser() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Non authentifié');
    }
    return session.user;
}
