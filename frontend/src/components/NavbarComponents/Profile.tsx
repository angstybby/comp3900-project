import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import ProfilePic from '../../assets/Mazesoba.jpg'
import Cookies from 'js-cookie'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Profile() {

  const logout = () => {
		Cookies.remove('token', { path: '' })
  }

    return (
      <Menu as="div" className="relative inline-block w-full text-left mt-auto bg-white hover:bg-gray-50">
        <div>
         	<MenuButton className="flex w-full justify-start items-center gap-x-5 rounded-md px-7 py-5 text-sm text-gray-900">
            <img className="w-11 h-11 rounded-full" src={ProfilePic} alt="Rounded avatar" />
            <div className='flex flex-col justify-start items-start tracking-widest'>
              <p className='font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-36'>Edrick Koda</p>
              <p>Student</p>
            </div>
          </MenuButton>
        </div>
        <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems anchor="top" className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <a
                    href="/profile"
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                  >
                    Account settings
                  </a>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <a
                    href='/'
                    onClick={() => logout()}
                    className={classNames(
                      focus ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block w-full px-4 py-2 text-left text-sm',
                    )}
                  >
                    Sign out
                  </a>
                )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu >
  )
}