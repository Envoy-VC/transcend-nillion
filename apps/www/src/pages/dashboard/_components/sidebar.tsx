import { Link, useLocation } from 'react-router-dom';

import React from 'react';

import LogoWhite from '../../../../public/logo-white.svg';

import { Button } from '~/components/ui/button';

const sidebarItems1 = [
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
  {
    name: 'Secrets Engine',
    href: '/dashboard/engine',
    regex: /^\/dashboard\/engine.*$/,
  },
  {
    name: 'Tools',
    href: '/dashboard/tools',
    regex: /^\/dashboard\/tools.*$/,
  },
];

const sidebarItems2 = [
  {
    name: 'Peers',
    href: '/dashboard/peers',
  },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <div className='!dark w-full max-w-[18rem] bg-black text-white'>
      <div className='sticky top-0 flex h-screen flex-col items-start px-3 py-4'>
        <img
          alt='Logo'
          className='my-2'
          height={48}
          src={LogoWhite as unknown as string}
          width={48}
        />
        <div className='px-2 pb-2 pt-6 text-sm font-medium text-gray-400'>
          Vault
        </div>
        <div className='flex w-full flex-col gap-[3px]'>
          {sidebarItems1.map((item) => {
            const isActive = item.regex
              ? RegExp(item.regex).test(pathname)
              : item.href === pathname;

            return (
              <Button
                key={item.name}
                asChild
                className='m-0 flex h-8 w-full justify-start px-2 !text-sm text-[#dedfe3]'
                variant={isActive ? 'secondary' : 'ghost'}
              >
                <Link to={item.href}>{item.name}</Link>
              </Button>
            );
          })}
        </div>
        <div className='px-2 pb-2 pt-6 text-sm font-medium text-gray-400'>
          Monitoring
        </div>
        <div className='flex w-full flex-col'>
          {sidebarItems2.map((item) => {
            const isActive = item.href === pathname;
            return (
              <Button
                key={item.name}
                asChild
                className='m-0 flex h-8 w-full justify-start px-2 !text-sm text-[#dedfe3]'
                variant={isActive ? 'secondary' : 'ghost'}
              >
                <Link to={item.href}>{item.name}</Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
