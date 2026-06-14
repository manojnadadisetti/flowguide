import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, onRedirect }) {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      onRedirect('login');
    }
  }, [token, onRedirect]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
