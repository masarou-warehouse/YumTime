// CartScreen.tsx
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { FIREBASE_AUTH } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type CartScreenNavigationProp = StackNavigationProp<StackParamList, 'Cart'>;

type Props = {
  navigation: CartScreenNavigationProp;
};

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const user = FIREBASE_AUTH.currentUser;

  const handleCheckout = () => {
    if (user) {
      // Proceed to Checkout
      navigation.navigate('Checkout');
    } else {
      // Prompt to Log In or Sign Up
      Alert.alert(
        'Login Required',
        'You need to log in or sign up to place an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => navigation.navigate('Login') },
          { text: 'Sign Up', onPress: () => navigation.navigate('SignUp') },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${parseFloat(item.price.replace(/,/g, '.')).toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => removeFromCart(item)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
            <Text style={styles.clearCartText}>Clear Cart</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  removeText: {
    color: '#ff6347',
  },
  clearCartButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  clearCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;