'use client';

import React from 'react';

import { Box } from '../create/_components';
import { LoginForm } from './_components';

const LoginPage = () => {
  return (
    <div className='flex items-center py-24 justify-center'>
      <Box>
        <LoginForm />
      </Box>
    </div>
  );
};

export default LoginPage;
