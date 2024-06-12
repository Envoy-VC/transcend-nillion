import { useEffect } from 'react';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  type SessionServiceOptions,
  sessionReducer,
  sessionService,
} from 'redux-react-session';

const reducers = {
  session: sessionReducer,
};

interface UserSession {
  userId: string;
  storeId: string;
  score: number;
  expires: number;
}

const validateSession = (session: UserSession) => {
  return session.expires > Date.now() && session.score < 550;
};

const opts: SessionServiceOptions = {
  refreshOnCheckAuth: true,
  driver: 'COOKIES',
  validateSession,
  // 24 hours
  expires: 24 * 60 * 60 * 1000,
};

const reducer = combineReducers(reducers);

export const useSession = () => {
  const store = configureStore({
    reducer,
  });

  useEffect(() => {
    sessionService
      .initSessionService(store, opts)
      .then(() => {
        console.log('Session Service Initialized');
      })
      .catch((err: unknown) => console.error(err));
  }, [store]);

  const getSession = async () => {
    const session = (await sessionService.loadSession()) as UserSession;
    return session;
  };

  const saveSession = async (session: UserSession) => {
    await sessionService.saveSession(session);
  };

  const isValidSession = async () => {
    const session = (await sessionService.loadSession()) as UserSession;
    return validateSession(session);
  };

  return { store, getSession, saveSession, isValidSession };
};
