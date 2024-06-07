import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <h1 className='border-b border-neutral-300 pb-3 text-3xl font-semibold text-neutral-700'>
      {title}
    </h1>
  );
};
