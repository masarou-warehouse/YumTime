// SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE, FIREBASE_STORAGE } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type SignUpScreenNavigationProp = StackNavigationProp<StackParamList, 'SignUp'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
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
      aspect: [1,1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
        username,
        email,
        profileImageURL,
      });

      setMessage({ type: 'success', text: 'Account created successfully!' });
      navigation.navigate('Profile');
    } catch (error: any) {
      console.log('Sign Up Error', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred during sign up.' });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        {message && (
          <View style={[styles.messageBox, message.type === 'success' ? styles.success : styles.error]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        )}
        <Text style={styles.title}>Sign Up</Text>
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
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
          <Text style={{ color: '#ff8c00', textAlign: 'center' }}>
            {profileImage ? 'Change Profile Image' : 'Add Profile Image'}
          </Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        )}
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default SignUpScreen;