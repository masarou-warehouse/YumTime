import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList, FoodItem } from '../navigations/type';
import { useCart } from '../context/CartContext';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const items: FoodItem[] = [
    {
      name: 'Cheese vegetable pizza',
      image: 'https://example.com/cheese-vegetable-pizza.jpg',
      rating: '5.0',
      favorites: '1.2k',
      price: '239,000 đ',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    // Add more items as needed
  ];

  const { addToCart } = useCart();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for any foods"
            placeholderTextColor="#888"
          />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.category}>
          <Ionicons name="restaurant" size={30} color="#FF4500" />
          <Text style={styles.categoryText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Ionicons name="pizza" size={30} color="#888" />
          <Text style={styles.categoryText}>Pizza</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Ionicons name="fast-food" size={30} color="#888" />
          <Text style={styles.categoryText}>Fast food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Ionicons name="fish" size={30} color="#888" />
          <Text style={styles.categoryText}>Sea food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Ionicons name="cafe" size={30} color="#888" />
          <Text style={styles.categoryText}>Drinks</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Most popular</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => navigation.navigate('FoodDetail', { item })}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.itemRating}>{item.rating} ({item.favorites} favorites)</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={styles.sectionTitle}>Best choice</Text>
      {/* Repeat the food items or create another list for "Best choice" */}
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.itemContainer}
          onPress={() => navigation.navigate('FoodDetail', { item })}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.itemRating}>{item.rating} ({item.favorites} favorites)</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
      {/* Remove the manually added Profile button */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    padding: 20,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: '#333',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  category: {
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  itemImage: {
    width: 120,
    height: 120,
  },
  itemInfo: {
    flex: 1,
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemPrice: {
    color: '#fff',
    marginVertical: 5,
  },
  itemRating: {
    color: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#FF4500',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 10,
  },
  addToCartText: {
    color: '#fff',
  },
});

export default HomeScreen;
