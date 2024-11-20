import React from 'react';
import AppNavigator from '../app/navigations/AppNavigator';
import { AuthProvider } from '../app/auth/useAuth';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;

