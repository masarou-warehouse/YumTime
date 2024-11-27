// useAuth.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signIn: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  signUp: (email: string, password: string, displayName: string, profileImage: string | null) => Promise<FirebaseAuthTypes.UserCredential>;
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
    const unsubscribe = auth().onAuthStateChanged(async (userState) => {
      if (userState) {
        const userDoc = await firestore().collection('users').doc(userState.uid).get();
        if (userDoc.exists) {
          // You can set additional user data here if needed
        }
      }
      setUser(userState);
    });
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential;
  };

  const signUp = async (email: string, password: string, displayName: string, profileImage: string | null) => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const { uid } = userCredential.user;

    let photoURL = null;
    if (profileImage) {
      const response = await fetch(profileImage);
      const blob = await response.blob();
      const storageRef = storage().ref().child(`profileImages/${uid}`);
      await storageRef.put(blob);
      photoURL = await storageRef.getDownloadURL();
    }

    // Update user profile
    await userCredential.user.updateProfile({
      displayName: displayName,
      photoURL: photoURL,
    });

    // Save additional user info in Firestore
    await firestore().collection('users').doc(uid).set({
      displayName: displayName,
      email: email,
      photoURL: photoURL,
    });

    return userCredential;
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