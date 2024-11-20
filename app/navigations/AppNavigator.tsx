import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, CartScreen, ProfileScreen, LoginScreen, FoodDetailScreen } from '../screens';
import { useAuth } from '../auth/useAuth';
import { StackParamList } from './type';

const Stack = createStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const user  = useAuth();
  if (user) {
    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="FoodDetail" component={FoodDetailScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default AppNavigator;
