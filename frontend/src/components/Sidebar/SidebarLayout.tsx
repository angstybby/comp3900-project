import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar/Sidebar';

const SidebarLayout = () => (
    <>
        <Sidebar />
        <div className='lg:ml-64'>
            <Outlet />
        </div>
    </>
);

export default SidebarLayout;