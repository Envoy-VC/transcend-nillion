import React, { type PropsWithChildren } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

export const ignoreCircularReferences = () => {
  const seen = new WeakSet();
  return (key: string, value: object | null) => {
    if (key.startsWith('_')) return;
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) return;
      seen.add(value);
    }
    return value;
  };
};

export const SlideIn = ({ children }: PropsWithChildren) => {
  const animation = {
    initial: { x: 382, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -382, opacity: 0 },
  };
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={JSON.stringify(children, ignoreCircularReferences())}
        transition={{ duration: 0.25 }}
        {...animation}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
