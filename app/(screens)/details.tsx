import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../lib/types';

type FoodDetailScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetail'>;

type Props = {
  route: FoodDetailScreenRouteProp;
};

const FoodDetailScreen: React.FC<Props> = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.rating}>
        {item.rating} ({item.favorites} favorites)
      </Text>
      <Text style={styles.details}>{item.details}</Text>
      <Text style={styles.price}>Current price: {item.price}</Text>
      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  rating: {
    fontSize: 16,
    color: '#888',
    marginVertical: 5,
  },
  details: {
    fontSize: 16,
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  addToCartButton: {
    backgroundColor: '#ff6347',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FoodDetailScreen;
