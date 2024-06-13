import React from 'react';

import { Decode, Encode } from '~/components';

import { withDashboardLayout } from '../_components';

export const ToolsPage = () => {
  return withDashboardLayout(
    <div>
      <div className='flex w-full flex-row items-center justify-between border-b border-neutral-300 pb-3'>
        <h1 className='text-3xl font-semibold text-neutral-700'>Tools</h1>
      </div>
      <div className='mt-4 flex flex-col gap-4'>
        <Encode />
        <Decode />
      </div>
    </div>
  );
};
