import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import HomeScreen from './(tabs)/home';
import FoodDetailScreen from './(screens)/details';
import { RootStackParamList } from './lib/types';

const Stack = createStackNavigator<RootStackParamList>();

const RootLayout = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerTitle: 'Food Details' }} />
    </Stack.Navigator>
  );
};

export default RootLayout;
