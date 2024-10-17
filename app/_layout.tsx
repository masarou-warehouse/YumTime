import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router'
import React from 'react'
import FoodDetailScreen from './(screens)/details'

const RootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }}/>
      {/* <Stack.Screen name="detail" component={FoodDetailScreen} /> */}
    </Stack>
  )
}

export default RootLayout