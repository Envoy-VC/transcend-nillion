import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Logo from '../../public/logo.svg';
import { Button } from './ui/button';

export const Navbar = () => {
  const { pathname } = useLocation();

  const isDashboard = pathname.startsWith('/dashboard');

  if (!isDashboard)
    return (
      <div className='flex w-full flex-row items-center justify-between gap-2 border-b px-4 py-3'>
        <div className='flex flex-row items-center gap-2'>
          <img
            alt='Transcend Logo'
            className='h-8 w-8 rounded-full'
            src={Logo}
          />
          <div className='text-xl font-semibold'>TRANSCEND</div>
        </div>
        <Button className='bg-[#4D7CFE]'>
          <Link to='/dashboard'>Dashboard</Link>
        </Button>
      </div>
    );

  return null;
};
