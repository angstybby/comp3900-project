import { useEffect } from 'react';
import Profile from './NavbarComponents/Profile';
import SidebarButton from './NavbarComponents/SidebarButton';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  CalculatorIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigation = useNavigate()
  let token = Cookies.get('token');
  useEffect(() => {
		if (token === undefined) {
			navigation('/')
		}
  }, [token]);

  return (
    <div className='fixed flex flex-col w-64 bg-white items-center h-screen shadow-xl rounded-r-xl pt-10'>
      <div className='flex flex-col w-full items-center gap-1'>
        <div className="text-center font-extralight py-4 text-4xl tracking-wide">
          Skill <br />Issue
        </div>
        </div>
        <div className='flex flex-col w-full gap-10 mt-14 mb-10'>
          <SidebarButton href='/dashboard' Icon={<HomeIcon />} text='Dashboard' />
          <SidebarButton href='/courses' text='Courses' Icon={<BookOpenIcon />} />
          <SidebarButton href='/groups' text='Groups' Icon={<UserGroupIcon />} />
          <SidebarButton href='/projects' text='Projects' Icon={<CalculatorIcon />} />
          <SidebarButton href='/profile' text='Profile' Icon={<UserIcon />} />
          {Cookies.get('userType') == 'admin' &&
            <SidebarButton href='/manage-users' text='Manage Users' Icon={<UsersIcon />} />
          }
        </div>
        <Profile />
    </div>
  );
};

export default Sidebar;
