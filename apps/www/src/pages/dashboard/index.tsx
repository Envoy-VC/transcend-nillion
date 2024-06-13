import React from 'react';

import { Card } from '~/components';

import { Header, withDashboardLayout } from './_components';

import { BookLock, Hammer, Key } from 'lucide-react';

export const DashboardPage = () => {
  return withDashboardLayout(
    <div>
      <Header title='Dashboard' />
      <div className='flex flex-row flex-wrap items-center gap-6 py-6'>
        <Card
          Icon={Key}
          href='/dashboard/engine'
          subtitle='Manage your secrets'
          title='Secrets Engine'
        />
        <Card
          Icon={BookLock}
          href='/dashboard/engine/new'
          subtitle='Create a new secret'
          title='New Secret'
        />
        <Card
          Icon={Hammer}
          href='/dashboard/tools'
          subtitle='Encode and decode secrets'
          title='Tools'
        />
      </div>
    </div>
  );
};
