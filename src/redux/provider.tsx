'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { setAuthFromStorage, setAuthChecked } from './slices/authSlice/authSlice';
import '../config/axiosInterceptor';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authData = JSON.parse(auth);
      store.dispatch(setAuthFromStorage(authData));
    }
    store.dispatch(setAuthChecked());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}