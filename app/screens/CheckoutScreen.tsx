// CheckoutScreen.tsx
import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { FIRESTORE, FIREBASE_AUTH } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type CheckoutScreenNavigationProp = StackNavigationProp<StackParamList, 'Checkout'>;

type Props = {
  navigation: CheckoutScreenNavigationProp;
};

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const { cartItems, clearCart } = useCart();
  const user = FIREBASE_AUTH.currentUser;
  const [processing, setProcessing] = useState<boolean>(false);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.price.replace(/,/g, '.')), 0).toFixed(2);
  };

  const handleConfirmCheckout = async () => {
    if (!user) {
      Alert.alert('Authentication Error', 'User not authenticated.');
      navigation.navigate('Login');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Your cart is empty.');
      return;
    }

    setProcessing(true);

    try {
      const ordersCollection = collection(FIRESTORE, 'users', user.uid, 'orders');
      await addDoc(ordersCollection, {
        items: cartItems,
        total: calculateTotal(),
        createdAt: Timestamp.now(),
      });
      clearCart();
      Alert.alert('Success', 'Your order has been placed successfully!');
      navigation.navigate('Profile');
    } catch (error: any) {
      console.log('Checkout Error:', error);
      Alert.alert('Error', error.message || 'An error occurred during checkout.');
    } finally {
      setProcessing(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>${parseFloat(item.price.replace(/,/g, '.')).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            style={styles.list}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${calculateTotal()}</Text>
          </View>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmCheckout}
            disabled={processing}
          >
            <Text style={styles.confirmButtonText}>
              {processing ? <ActivityIndicator color="#fff" /> : 'Confirm Checkout'}
            </Text>
          </TouchableOpacity>
        </>
      )}
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
  list: {
    flexGrow: 0,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 18,
    color: '#555',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff8c00',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;