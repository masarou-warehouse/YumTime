// SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE, FIREBASE_STORAGE } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type SignUpScreenNavigationProp = StackNavigationProp<StackParamList, 'SignUp'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

type MessageType = {
  type: 'success' | 'error';
  text: string;
} | null;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [message, setMessage] = useState<MessageType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = FIREBASE_AUTH;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setMessage({ type: 'error', text: 'Permission to access gallery is required!' });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password.trim() || !phone.trim() || !address.trim() || !birthdate.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
  
    if (email.trim().endsWith('@admin.yumtime.com')) {
      setMessage({ type: 'error', text: 'Admin emails cannot sign up through this form.' });
      setLoading(false);
      return;
    }
  
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
  
      let profileImageURL = '';
      if (profileImage) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        const storageRef = ref(FIREBASE_STORAGE, `profiles/${user.uid}`);
        await uploadBytes(storageRef, blob);
        profileImageURL = await getDownloadURL(storageRef);
      }
  
      await setDoc(doc(FIRESTORE, 'users', user.uid), {
        username: username.trim(),
        email: email.trim(),
        profileImageURL,
        phone: phone.trim(),
        address: address.trim(),
        birthdate: birthdate.trim(),
      });
  
      setMessage({ type: 'success', text: 'Account created successfully! Please sign in.' });
  
      // Sign out the user after sign-up
      await signOut(FIREBASE_AUTH);
  
      // Navigate to Login screen
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
  
    } catch (error: any) {
      console.error('Sign Up Error', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred during sign up.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {message && (
          <View style={[styles.messageBox, message.type === 'success' ? styles.success : styles.error]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        )}
        <Text style={styles.title}>Sign Up</Text>
        <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
          <Text style={{ color: '#ff8c00', textAlign: 'center' }}>
            {profileImage ? 'Change Profile Image' : 'Add Profile Image'}
          </Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <TextInput
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry
        />
        <TextInput
          placeholder="Phone"
          onChangeText={setPhone}
          value={phone}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Address"
          onChangeText={setAddress}
          value={address}
          style={styles.input}
        />
        <TextInput
          placeholder="Birthdate (YYYY-MM-DD)"
          onChangeText={setBirthdate}
          value={birthdate}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  messageBox: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  success: {
    backgroundColor: '#d4edda',
  },
  error: {
    backgroundColor: '#f8d7da',
  },
  messageText: {
    color: '#155724',
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10
  },
  profileImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 10
  },
  buttonDisabled: {
    backgroundColor: '#ffa366',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default SignUpScreen;