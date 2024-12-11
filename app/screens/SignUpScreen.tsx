// SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Platform, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../config/firebase';

const SignUpScreen = () => {
  // const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [displayName, setDisplayName] = useState('');
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;

  const handleSignUp = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.log('Sign Up Error', error);
      Alert.alert('Sign Up Error', error.message || 'An error occurred during sign up.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Sign Up
        </Text>
        {/* <TextInput
          placeholder="Name"
          onChangeText={setDisplayName}
          value={displayName}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
        /> */}
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
          secureTextEntry
        />
        {/* <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
          <Text style={{ color: '#ff8c00', textAlign: 'center' }}>
            {profileImage ? 'Change Profile Image' : 'Add Profile Image'}
          </Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20, borderRadius: 50 }} />
        )} */}
        <TouchableOpacity onPress={handleSignUp} style={{ backgroundColor: '#ff8c00', padding: 15, borderRadius: 10 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;