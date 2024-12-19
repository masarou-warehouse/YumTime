// ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';
import { FIRESTORE, FIREBASE_AUTH } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import NetInfo from '@react-native-community/netinfo';

type ProfileScreenNavigationProp = StackNavigationProp<StackParamList, 'Profile'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type UserData = {
  username: string;
  email: string;
  profileImageURL?: string;
  phone?: string;
  address?: string;
  birthdate?: string;
  isAdmin?: boolean;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(FIREBASE_AUTH, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(FIRESTORE, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            console.log('No such document!');
            setUserData(null);
          }
        } catch (error) {
          console.log('Error fetching user data:', error);
          Alert.alert('Error', 'Unable to fetch user data.');
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
  
    return () => {
      unsubscribeAuth();
    };
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

  if (isOffline) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>You are offline. Please check your internet connection.</Text>
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
      {loading ? (
        <ActivityIndicator size="large" color="#ff8c00" />
      ) : userData ? (
        <>
          {userData.profileImageURL && (
            <Image source={{ uri: userData.profileImageURL }} style={styles.profileImage} />
          )}
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          {/* <Text style={styles.phone}>Phone: {userData.phone}</Text>
          <Text style={styles.address}>Address: {userData.address}</Text> */}
          <Text style={styles.birthdate}>Birthdate: {userData.birthdate}</Text>
          <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
          {userData.isAdmin && (
            <TouchableOpacity onPress={() => navigation.navigate('Admin')} style={styles.adminButton}>
              <Text style={styles.adminButtonText}>Admin Panel</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text>No user data available.</Text>
      )}
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
  username: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  email: { 
    fontSize: 18, 
    color: '#555', 
    marginBottom: 30 
  },
  birthdate: { 
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
  adminButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  adminButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;