// useAuth.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  updateProfile 
} from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE, FIREBASE_STORAGE } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string, 
    password: string, 
    displayName: string, 
    profileImage: string | null
  ) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    // User state is automatically handled by onAuthStateChanged
  };

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    profileImage: string | null
  ) => {
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
    const currentUser = userCredential.user;

    let photoURL: string | null = null;

    if (profileImage) {
      const response = await fetch(profileImage);
      const blob = await response.blob();
      const storageRef = ref(FIREBASE_STORAGE, `profileImages/${currentUser.uid}`);
      await uploadBytes(storageRef, blob);
      photoURL = await getDownloadURL(storageRef);
    }

    // Update user profile
    await updateProfile(currentUser, {
      displayName,
      photoURL: photoURL || undefined,
    });

    // Save additional user info to Firestore
    await setDoc(doc(FIRESTORE, 'users', currentUser.uid), {
      displayName,
      email,
      photoURL: photoURL || null,
    });
  };

  const signOutUser = async () => {
    await firebaseSignOut(FIREBASE_AUTH);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut: signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);