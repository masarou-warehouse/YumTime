import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, CartScreen, ProfileScreen, LoginScreen, SignUpScreen, FoodDetailScreen } from '../screens';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Cart" component={CartScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="FoodDetail" component={FoodDetailScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="SignUp" component={SignUpScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;