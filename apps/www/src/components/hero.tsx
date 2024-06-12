import React from 'react';

import HeroBG from '../../public/hero.svg';

export const Hero = () => {
  return (
    <div className='flex flex-col items-center gap-6 px-3 py-16 text-center'>
      <h1 className='bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-5xl font-semibold text-transparent sm:text-6xl md:text-7xl'>
        Shared Secrets
        <br />
        Ironclad Security
      </h1>
      <p className='max-w-2xl text-pretty text-sm font-medium text-neutral-500 sm:text-base'>
        Secure Multi-Party Computation (MPC) for Secret Storage and Biometric
        Authentication. Enables secure, collaborative access to sensitive data
        without a single point of control.
      </p>
      <img
        alt=''
        className='w-full max-w-xl'
        crossOrigin='anonymous'
        src={HeroBG}
      />
    </div>
  );
};
