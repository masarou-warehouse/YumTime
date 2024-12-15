// FoodDetailScreen.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';
import { useCart } from '../context/CartContext';

type Props = StackScreenProps<StackParamList, 'FoodDetail'>;

const FoodDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { item } = route.params;
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(item);
    navigation.navigate('Cart');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="star-border" size={24} />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <View style={styles.subtitle}>
          <Text style={styles.category}>Pizza</Text>
          <Text style={styles.rating}>
            <Icon name="star" size={16} color="gold" /> {item.rating} ({item.favorites} favorites)
          </Text>
        </View>
        <Text style={styles.detailsTitle}>Details</Text>
        <Text style={styles.details}>{item.details}</Text>
        <Text style={styles.priceLabel}>Current price:</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  category: {
    marginRight: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginVertical: 10,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: '#FF4500',
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#FF4500',
    borderRadius: 25,
    alignItems: 'center',
    paddingVertical: 15,
    margin: 15,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FoodDetailScreen;