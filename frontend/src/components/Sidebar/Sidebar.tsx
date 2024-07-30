import { useEffect, useState } from 'react';
import Profile from '@/components/NavbarComponents/Profile';
import SidebarButton from '@/components/NavbarComponents/SidebarButton';
import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  UserIcon,
  CalculatorIcon,
  UsersIcon,
  XMarkIcon,
  Bars3Icon,
  NumberedListIcon
} from '@heroicons/react/24/outline';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const navigation = useNavigate()
  let token = Cookies.get('token');
  useEffect(() => {
    if (token === undefined) {
      navigation('/')
    }
  }, [token]);

  const { updateProfileContext } = useProfile();
  useEffect(() => {
    updateProfileContext();
  }, [])

  return (
    <>
      <div className="fixed top-4 left-4 lg:hidden z-50 w-64">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <XMarkIcon className="w-8 h-8" />
          ) : (
            <Bars3Icon className="w-8 h-8" />
          )}
        </button>
      </div>
      <div
        className={`fixed flex flex-col w-64 bg-white items-center h-screen shadow-xl pt-10 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 z-40`}
      >
        <div className='flex flex-col w-full items-center gap-1'>
          <div className="text-center font-extralight py-4 text-4xl tracking-wide">
            Skill <br />Issue
          </div>
        </div>
        <div className='flex flex-col w-full gap-10 mt-14 mb-10'>
          <SidebarButton href='/dashboard' Icon={<HomeIcon />} text='Dashboard' />
          <SidebarButton href='/courses' text='Courses' Icon={<BookOpenIcon />} />
          {Cookies.get('userType') === 'student' &&
            <SidebarButton href='/groups' text='Groups' Icon={<UserGroupIcon />} />
          }
          <SidebarButton href='/projects' text='Projects' Icon={<CalculatorIcon />} />
          <SidebarButton href='/leaderboard' text='Leaderboard' Icon={<NumberedListIcon />} />
          <SidebarButton href='/profile' text='Profile' Icon={<UserIcon />} />
          {Cookies.get('userType') === 'admin' &&
            <SidebarButton href='/manage-users' text='Manage Users' Icon={<UsersIcon />} />
          }
        </div>
        <Profile />
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
