import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/store';
import { refreshAuth } from '@/features/auth/authSlice';
import AppRouter from '@/routes/AppRouter';

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // On app load, try to restore the session using the httpOnly
    // refresh token cookie. If the cookie exists and is valid, this
    // silently logs the user back in. If not, it fails silently and
    // the user stays logged out — no error shown.
    dispatch(refreshAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}