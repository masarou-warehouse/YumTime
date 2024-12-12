// ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Alert 
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';
import { FIRESTORE, FIREBASE_AUTH } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';

type ProfileScreenNavigationProp = StackNavigationProp<StackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type UserData = {
  username: string;
  email: string;
  profileImageURL: string | null;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(FIRESTORE, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.log('Error fetching user data:', error);
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.navigate('Login');
    } catch (error: any) {
      console.log('Sign Out Error', error);
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your profile.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData?.profileImageURL ? (
        <Image source={{ uri: userData.profileImageURL }} style={styles.profileImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>
            {userData?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
      )}
      <Text style={styles.name}>{userData?.username || 'No Name'}</Text>
      <Text style={styles.email}>{userData?.email}</Text>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  message: { 
    fontSize: 18, 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#ff8c00', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    width: '100%' 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  profileImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    marginBottom: 20 
  },
  placeholderImage: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    backgroundColor: '#ccc', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20 
  },
  placeholderText: { 
    fontSize: 40, 
    color: '#fff' 
  },
  name: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  email: { 
    fontSize: 18, 
    color: '#555', 
    marginBottom: 30 
  },
  signOutButton: { 
    backgroundColor: '#ff4d4d', 
    padding: 15, 
    borderRadius: 10, 
    width: '100%' 
  },
  signOutText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ProfileScreen;