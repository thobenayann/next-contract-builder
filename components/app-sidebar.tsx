import { getUserSession } from '@/app/_lib/getUserSession';
import { AppSidebarClient } from './app-sidebar-client';

export const AppSidebar = async () => {
    const userSession = await getUserSession();

    if (!userSession) {
        return null;
    }

    return <AppSidebarClient userSession={userSession} />;
};
