import React, { type PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSession } from '~/lib/hooks';

import { Sidebar } from './sidebar';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { isValidSession } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    isValidSession().then((res) => {
      if (!res) {
        navigate('/login');
      }
    });
  }, []);

  return (
    <div className='flex flex-row'>
      <Sidebar />
      <div className='mx-auto my-12 w-full max-w-screen-lg'>{children}</div>
    </div>
  );
};

export const withDashboardLayout = (Component: React.JSX.Element) => {
  return <DashboardLayout>{Component}</DashboardLayout>;
};
