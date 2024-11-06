import React from 'react';
import { View, Text, Button, Image, Touchable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const LoginScreen = () => {
  const handleGoogleLogin = async () => {
    // Implement Google Sign-In
  };

  return (
    <SafeAreaView className='flex-1' style={{backgroundColor: '#fff'}}>
      <View className='flex-1 flex justify-around my-4'>
        <Text className='text-black font-bold text-3xl text-center'>
          YUMTIME
        </Text>
        <View className='flex-row justify-center'>
          <Image
            style={{width: 500, height: 350}}
            source={require('../../assets/CONTAINER.png')}
          />
        </View>
        <Text className='text-black font-bold text-xl text-center'>
          WHAT'S YOUR FAVOURITE FOOD?
        </Text>
        <View className="space-y-4">
          <TouchableOpacity className="py-3 bg-orange-400 mx-7 rounded-xl">
            <Text className="text-white text-center font-bold text-xl">
            Sign Up with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
