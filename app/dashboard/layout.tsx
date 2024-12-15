import { AppSidebar } from '@/components/app-sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <AppSidebar />
            <main className="flex-1 transition-all duration-300 pl-[60px] lg:pl-[200px]">
                <div className="container p-6">{children}</div>
            </main>
        </div>
    );
}
