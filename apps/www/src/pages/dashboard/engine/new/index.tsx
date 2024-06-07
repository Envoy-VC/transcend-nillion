import React from 'react';

import { NewSecretForm } from './_components';
import { withDashboardLayout } from '../../_components';

export const NewSecretPage = () => {
  return withDashboardLayout(
    <div className='flex flex-col gap-4'>
      <NewSecretForm />
    </div>
  );
};
