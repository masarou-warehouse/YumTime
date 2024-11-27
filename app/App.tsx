import React from 'react';
import AppNavigator from '../app/navigations/AppNavigator';
import { AuthProvider } from '../app/auth/useAuth';
import { CartProvider } from '../app/context/CartContext';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;