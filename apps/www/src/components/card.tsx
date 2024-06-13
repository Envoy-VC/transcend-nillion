import { Link } from 'react-router-dom';

import { type Cable } from 'lucide-react';

interface CardProps {
  title: string;
  subtitle: string;
  Icon: typeof Cable;
  href: string;
}
export const Card = ({ title, subtitle, Icon, href }: CardProps) => {
  return (
    <Link
      className='group relative w-full max-w-xs overflow-hidden rounded border-[1px] border-slate-300 bg-white p-4'
      to={href}
    >
      <div className='absolute inset-0 translate-y-[100%] bg-gradient-to-r from-indigo-400 to-cyan-400 transition-transform duration-300 group-hover:translate-y-[0%]' />
      <Icon
        className='absolute -right-8 -top-8 z-10 text-9xl text-slate-100 transition-transform duration-300 group-hover:rotate-12 group-hover:text-blue-400'
        size={128}
      />
      <Icon className='relative z-10 mb-2 text-2xl text-blue-600 transition-colors duration-300 group-hover:text-white' />
      <h3 className='relative z-10 text-lg font-medium text-slate-950 duration-300 group-hover:text-white'>
        {title}
      </h3>
      <p className='relative z-10 text-slate-400 duration-300 group-hover:text-violet-200'>
        {subtitle}
      </p>
    </Link>
  );
};
