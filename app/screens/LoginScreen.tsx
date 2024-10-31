import React from 'react';
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const handleGoogleLogin = async () => {
    // Implement Google Sign-In
  };

  return (
    <View>
      <Text>YUMTIME</Text>
      <Button title="Sign in with Google" onPress={handleGoogleLogin} />
    </View>
  );
};

export default LoginScreen;
