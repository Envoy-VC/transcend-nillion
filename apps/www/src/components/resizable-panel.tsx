import React, { type PropsWithChildren } from 'react';
import useMeasure from 'react-use-measure';

import { cn } from '~/lib/utils';

import { MotionConfig, motion } from 'framer-motion';

export const ResizablePanel = ({ children }: PropsWithChildren) => {
  const [ref, { height }] = useMeasure();

  return (
    <MotionConfig transition={{ duration: 0.45 }}>
      <motion.div
        animate={{ height: height || 'auto' }}
        className='relative overflow-hidden rounded-3xl shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px,rgba(0,0,0,0.08)_0px_0px_0px_1px]'
      >
        <motion.div className={cn(height ? 'absolute' : 'relative', 'w-full')}>
          <div ref={ref} className='w-full'>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};
