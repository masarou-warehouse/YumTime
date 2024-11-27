// CustomTabBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width } = Dimensions.get('window');

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {/* Home Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name={state.index === 0 ? 'home' : 'home-outline'}
          size={24}
          color={state.index === 0 ? '#FF4500' : '#888'}
        />
      </TouchableOpacity>

      {/* Cart Button */}
      <TouchableOpacity
        style={styles.cartContainer}
        onPress={() => navigation.navigate('Cart')}
      >
        <View
          style={[
            styles.cartButton,
            state.index === 1 ? styles.cartButtonActive : styles.cartButtonInactive,
          ]}
        >
          <Ionicons
            name={state.index === 1 ? 'cart' : 'cart-outline'}
            size={24}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons
          name={state.index === 2 ? 'person' : 'person-outline'}
          size={24}
          color={state.index === 2 ? '#FF4500' : '#888'}
        />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 75,
    right: 75,
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 5,
    zIndex: 100, // Ensure the tab bar is above other elements
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  cartContainer: {
    // position: 'center',
    alignSelf: 'center',
  },
  cartButton: {
    width: 68,
    height: 68,
    borderRadius: 40,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    elevation: 5,
  },
  cartButtonActive: {
    backgroundColor: '#FF4500',
  },
  cartButtonInactive: {
    backgroundColor: '#000',
  },
});

export default CustomTabBar;