import { AppSidebar } from '@/components/app-sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({
    children,
}: DashboardLayoutProps): React.ReactElement => {
    return (
        <>
            <AppSidebar />
            <div className='ml-[200px] p-6'>{children}</div>
        </>
    );
};

export default DashboardLayout;
