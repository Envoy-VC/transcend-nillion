import React, { type PropsWithChildren } from 'react';

import { Sidebar } from './_components';

const DashboardLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-row'>
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLayout;
