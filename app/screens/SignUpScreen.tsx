// SignUpScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/useAuth';
import * as ImagePicker from 'expo-image-picker';

const SignUpScreen = () => {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await signUp(email, password, displayName, profileImage);
    } catch (error) {
      console.log('Sign Up Error', error);
    }
  };

  const pickImage = async () => {
    // Request media library permissions
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission denied!');
        return;
      }
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Sign Up
        </Text>
        <TextInput
          placeholder="Name"
          onChangeText={setDisplayName}
          value={displayName}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 }}
        />
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
        <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
          <Text style={{ color: '#ff8c00', textAlign: 'center' }}>
            {profileImage ? 'Change Profile Image' : 'Add Profile Image'}
          </Text>
        </TouchableOpacity>
        {profileImage && (
          <Image source={{ uri: profileImage }} style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20, borderRadius: 50 }} />
        )}
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