import Profile from './NavbarComponents/Profile';
import SidebarButton from './NavbarComponents/SidebarButton';
import {
    HomeIcon,
    BookOpenIcon,
    UserGroupIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
    return (
        <div className='fixed flex flex-col w-64 bg-white items-center h-screen shadow-xl rounded-r-xl pt-10'>
            <div className='flex flex-col w-full items-center gap-1'>
                <div className="text-center font-extralight py-4 text-4xl tracking-wide">
                    Skill <br />Issue
                </div>
            </div>

            <div className='flex flex-col w-full gap-10 mt-20'>
                <SidebarButton href='/dashboard' Icon={<HomeIcon />} text='Dashboard' />
                <SidebarButton href='/course' text='Courses' Icon={<BookOpenIcon />} />
                <SidebarButton href='/group' text='Groups' Icon={<UserGroupIcon />} />
                <SidebarButton href='/profile' text='Profile' Icon={<UserIcon />} />
            </div>

            <Profile />
        </div>
    );
};

export default Sidebar;
