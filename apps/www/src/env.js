import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    IRON_SESSION_PASSWORD: z.string().min(1),
    NODE_ENV: z.enum(['development', 'test', 'production']),
  },
  client: {
    NEXT_PUBLIC_BOOTSTRAP_MULTIADDRS: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_ID: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
    NEXT_PUBLIC_BOOTSTRAP_MULTIADDRS:
      process.env.NEXT_PUBLIC_BOOTSTRAP_MULTIADDRS,
  },
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
  emptyStringAsUndefined: true,
});
