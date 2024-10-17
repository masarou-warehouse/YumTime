import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Stack } from 'expo-router';
// import { RootStackParamList } from '../App';

// type Props = <Stack></Stack><RootStackParamList, 'FoodDetail'>;

const FoodDetailScreen: React.FC = ({ navigation, route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="star-border" size={24} />
        </TouchableOpacity>
      </View>
      <Text style={styles.foodName}>{item.name}</Text>
      <View style={styles.foodInfo}>
        <Icon name="local-pizza" size={20} />
        <Text style={styles.foodCategory}>Pizza</Text>
        <Icon name="star" size={20} color="gold" />
        <Text style={styles.foodRating}>{item.rating} ({item.favorites} favorites)</Text>
      </View>
      <Image source={{ uri: item.image }} style={styles.foodImage} />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details</Text>
        <Text style={styles.detailsText}>{item.details}</Text>
        <Text style={styles.priceLabel}>Current price:</Text>
        <Text style={styles.price}>{item.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  foodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  foodCategory: {
    marginLeft: 5,
    marginRight: 15,
  },
  foodRating: {
    marginLeft: 5,
  },
  foodImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  detailsText: {
    color: '#666',
    marginBottom: 10,
  },
  priceLabel: {
    color: '#666',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  addToCartButton: {
    backgroundColor: '#ff6347',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 10,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FoodDetailScreen;
