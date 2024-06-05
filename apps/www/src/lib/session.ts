'use server';

import { cookies } from 'next/headers';

import { type SessionOptions } from 'iron-session';
import { getIronSession } from 'iron-session';
import { env } from '~/env';

export interface SessionData {
  storeId: string;
  distance: number;
  isLoggedIn: boolean;
  expires: string;
}

const sessionOptions: SessionOptions = {
  password: env.IRON_SESSION_PASSWORD,
  cookieName: 'biometric-session',
  cookieOptions: {
    secure: false,
  },
};

export const login = async (data: SessionData) => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.storeId = data.storeId;
  session.distance = data.distance;
  session.isLoggedIn = true;
  session.expires = data.expires;
  await session.save();
  return { success: true };
};

export const logout = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
  return {
    success: true,
  };
};

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
};
