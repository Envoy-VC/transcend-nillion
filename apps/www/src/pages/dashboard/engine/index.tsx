import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '~/components/ui/button';

import { AllSecretsTable, withDashboardLayout } from '../_components';

export const SecretsEnginePage = () => {
  return withDashboardLayout(
    <div>
      <div className='flex w-full flex-row items-center justify-between border-b border-neutral-300 pb-3'>
        <h1 className='text-3xl font-semibold text-neutral-700'>
          Secrets Engine
        </h1>
        <Button asChild>
          <Link to='/dashboard/engine/new'>Create Secret</Link>
        </Button>
      </div>

      <AllSecretsTable />
    </div>
  );
};
