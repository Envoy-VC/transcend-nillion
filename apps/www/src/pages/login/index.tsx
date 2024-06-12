import React from 'react';

import { Box } from '../create/_components';
import { LoginForm } from './_components';

export const LoginPage = () => {
  return (
    <div className='flex items-center justify-center py-24'>
      <Box>
        <LoginForm />
      </Box>
    </div>
  );
};
