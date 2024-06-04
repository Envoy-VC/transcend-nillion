'use client';

import React, { type PropsWithChildren } from 'react';

import { motion } from 'framer-motion';

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

export const SlideIn = ({
  children,
  key,
}: PropsWithChildren & { key: string }) => {
  const animation = {
    initial: { x: 0, opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -382, opacity: 1 },
  };
  return (
    <motion.div key={key} transition={{ duration: 0.25 }} {...animation}>
      {children}
    </motion.div>
  );
};
