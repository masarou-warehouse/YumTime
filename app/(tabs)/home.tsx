import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../lib/types'; // Adjust the path as needed

type HomeScreenProps = {
  navigation: NavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const foodItems = [
    {
      name: 'Cheese vegetable pizza',
      image: 'https://example.com/cheese-vegetable-pizza.jpg',
      rating: '5.0',
      favorites: '1.2k',
      price: '239,000 đ',
      details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    },
    // Add more food items here
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={24} />
        <Text style={styles.searchText}>Search for any foods</Text>
      </View>
      <View style={styles.categoryContainer}>
        <TouchableOpacity style={styles.category}>
          <Icon name="restaurant" size={30} />
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Icon name="local-pizza" size={30} />
          <Text>Pizza</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Icon name="fastfood" size={30} />
          <Text>Fast food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Icon name="emoji-food-beverage" size={30} />
          <Text>Sea food</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.category}>
          <Icon name="local-drink" size={30} />
          <Text>Drinks</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Most popular</Text>
      {foodItems.map((item, index) => (
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
            <TouchableOpacity style={styles.addToCartButton}>
              <Text style={styles.addToCartText}>Add to cart</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchText: {
    marginLeft: 10,
    color: '#aaa',
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  category: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#888',
    marginVertical: 5,
  },
  itemRating: {
    color: '#888',
  },
  addToCartButton: {
    backgroundColor: '#ff6347',
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