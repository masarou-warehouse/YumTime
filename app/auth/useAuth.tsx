// useAuth.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signIn: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {
    throw new Error('signIn function not implemented');
  },
  signUp: async () => {
    throw new Error('signUp function not implemented');
  },
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((userState) => {
      setUser(userState);
    });
    return unsubscribe;
  }, []);

  const signIn = (email: string, password: string) => {
    return auth().signInWithEmailAndPassword(email, password);
  };

  const signUp = (email: string, password: string) => {
    return auth().createUserWithEmailAndPassword(email, password);
  };

  const signOut = () => {
    return auth().signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
