'use client';

import React, { FC, ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarButtonProps {
    href: string;
    text: string;
    Icon: ReactElement;
}

const SidebarButton: FC<SidebarButtonProps> = ({
    href,
    text,
    Icon,
}): JSX.Element => {

    const location = useLocation();

    // Clone the Icon with additional classes
    const IconWithClasses = React.cloneElement(Icon, {
        className: `${Icon.props.className || ''} h-[24px] w-[24px]`,
    });

    // Check if the current route matches the href
    const isActive = location.pathname === href;

    return (
        <Link
            to={href}
            className={`flex items-center text-gray-500 hover:text-indigo-600 pl-12 px-10 ${isActive ? 'text-indigo-600' : '' // Apply active state styling conditionally
                }`}
        >
            <div className='flex justify-start w-full'>
                {IconWithClasses}
                <p className='ml-6 text-lg'>{text}</p>
            </div>
        </Link>
    );
};

export default SidebarButton;
