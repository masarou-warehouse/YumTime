import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { FIRESTORE } from '../config/firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

type FoodItem = {
  id: string;
  name: string;
  imagePath: string;
  rating: string;
  favorites: string;
  price: string;
  details: string;
};

const AdminScreen: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState({
    name: '',
    imagePath: '',
    rating: '',
    favorites: '',
    price: '',
    details: '',
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(FIRESTORE, 'foods'), (snapshot) => {
      const foodsList: FoodItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<FoodItem, 'id'>),
      }));
      setFoods(foodsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addFood = async () => {
    const { name, imagePath, rating, favorites, price, details } = newFood;
    if (!name || !imagePath) {
      Alert.alert('Error', 'Name and Image Path are required.');
      return;
    }

    try {
      await addDoc(collection(FIRESTORE, 'foods'), {
        name,
        imagePath,
        rating,
        favorites,
        price,
        details,
      });
      setNewFood({ name: '', imagePath: '', rating: '', favorites: '', price: '', details: '' });
      Alert.alert('Success', 'Food item added successfully.');
    } catch (error) {
      console.error('Error adding food:', error);
      Alert.alert('Error', 'Failed to add food item.');
    }
  };

  const removeFood = async (id: string) => {
    try {
      await deleteDoc(doc(FIRESTORE, 'foods', id));
      Alert.alert('Success', 'Food item removed successfully.');
    } catch (error) {
      console.error('Error removing food:', error);
      Alert.alert('Error', 'Failed to remove food item.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#ff8c00" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      
      <TextInput
        placeholder="Food Name"
        value={newFood.name}
        onChangeText={(text) => setNewFood({ ...newFood, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Image Path"
        value={newFood.imagePath}
        onChangeText={(text) => setNewFood({ ...newFood, imagePath: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Rating"
        value={newFood.rating}
        onChangeText={(text) => setNewFood({ ...newFood, rating: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Favorites"
        value={newFood.favorites}
        onChangeText={(text) => setNewFood({ ...newFood, favorites: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={newFood.price}
        onChangeText={(text) => setNewFood({ ...newFood, price: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Details"
        value={newFood.details}
        onChangeText={(text) => setNewFood({ ...newFood, details: text })}
        style={styles.input}
      />
      <TouchableOpacity onPress={addFood} style={styles.button}>
        <Text style={styles.buttonText}>Add Food</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Existing Foods</Text>
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.foodItem}>
            <Text>{item.name}</Text>
            <TouchableOpacity onPress={() => removeFood(item.id)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: '#ff8c00', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  foodItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee' },
  removeButton: { backgroundColor: '#ff4d4d', padding: 5, borderRadius: 5 },
  removeButtonText: { color: '#fff' },
});

export default AdminScreen;