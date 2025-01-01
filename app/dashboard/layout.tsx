import { AppSidebar } from '@/components/app-sidebar';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import { ModeToggle } from '@/components/mode-toggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <>
            <AppSidebar />
            <div className='ml-[200px]'>
                <header className='flex h-14 items-center justify-between border-b px-6'>
                    <div className='flex items-center gap-4'>
                        <BreadcrumbNav />
                    </div>
                    <ModeToggle />
                </header>
                <main className='p-6'>{children}</main>
            </div>
        </>
    );
};

export default DashboardLayout;
