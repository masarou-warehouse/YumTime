// LoginScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  Alert, 
  SafeAreaView 
} from 'react-native';
import { FIREBASE_AUTH } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type LoginScreenNavigationProp = StackNavigationProp<StackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

type MessageType = {
  type: 'success' | 'error';
  text: string;
} | null;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<MessageType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const auth = FIREBASE_AUTH;

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setMessage({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setMessage({ type: 'success', text: 'Logged in successfully! Redirecting...' });

      // Wait for 2 seconds before navigating
      setTimeout(() => {
        navigation.navigate('Profile');
      }, 2000);
    } catch (error: any) {
      console.log('Login Error', error);
      setMessage({ type: 'error', text: error.message || 'An error occurred during login.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {message && (
          <View 
            style={[
              styles.messageBox, 
              message.type === 'success' ? styles.success : styles.error
            ]}
          >
            <Text 
              style={[
                styles.messageText, 
                message.type === 'success' ? styles.successText : styles.errorText
              ]}
            >
              {message.text}
            </Text>
          </View>
        )}
        <Text style={styles.title}>Login</Text>
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
        <TouchableOpacity 
          onPress={handleLogin} 
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging In...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.link}>
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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
  successText: {
    color: '#155724',
  },
  errorText: {
    color: '#721c24',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
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
    marginBottom: 20,
    borderRadius: 5,
    color: '#333',
  },
  button: { 
    backgroundColor: '#ff8c00', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10 
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
  link: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#ff8c00', 
    fontSize: 16 
  },
});

export default LoginScreen;