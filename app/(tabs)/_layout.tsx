import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'
import React from 'react'

import icons from 'expo-constants';

interface TabIconProps {
    icon: any;
    color: string;
    name: string;
    focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
    return (
        <View>
            <Image 
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`text-xs ${focused ? 'text-blue-500' : 'text-gray-500'}`}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
  return (
    <>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
            }}
        >
          <Tabs.Screen 
            name="home" 
            options={{ 
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.home}
                        color={color}
                        name="Home"
                        focused={focused}
                    />
                )
            }}
           />
           <Tabs.Screen 
            name="cart" 
            options={{ 
                title: 'Cart',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.cart}
                        color={color}
                        name="Cart"
                        focused={focused}
                    />
                )
            }}
           />
           <Tabs.Screen 
            name="profile" 
            options={{ 
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                    <TabIcon 
                        icon={icons.profile}
                        color={color}
                        name="Profile"
                        focused={focused}
                    />
                )
            }}
           />
        </Tabs>
    </>
  )
}

export default TabsLayout