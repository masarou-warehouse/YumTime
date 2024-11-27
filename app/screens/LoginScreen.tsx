import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/useAuth';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type LoginScreenNavigationProp = StackNavigationProp<StackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (error) {
      console.log('Login Error', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1, justifyContent: 'center', paddingHorizontal: 20}}>
        <Text style={{textAlign: 'center', fontSize: 24, fontWeight: 'bold', marginBottom: 20}}>
          Login
        </Text>
        <TextInput
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          style={{borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10}}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          style={{borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20}}
          secureTextEntry
        />
        <TouchableOpacity onPress={handleLogin} style={{backgroundColor: '#ff8c00', padding: 15, borderRadius: 10}}>
          <Text style={{color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={{ textAlign: 'center', color: '#ff8c00', marginTop: 20 }}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;