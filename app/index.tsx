import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router';

const RootLayout = () => {
    return (
        <>
            <Text>Header</Text>
            <Slot />
        </>
    )
}
