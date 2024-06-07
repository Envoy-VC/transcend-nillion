import React, { type PropsWithChildren } from 'react';

import { Sidebar } from './sidebar';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
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
