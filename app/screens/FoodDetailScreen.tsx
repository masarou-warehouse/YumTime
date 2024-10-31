import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FoodDetail: { item: FoodItem };
};

type FoodDetailScreenRouteProp = RouteProp<RootStackParamList, 'FoodDetail'>;

type FoodDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'FoodDetail'
>;

type Props = {
  route: FoodDetailScreenRouteProp;
  navigation: FoodDetailScreenNavigationProp;
};

interface FoodItem {
  name: string;
  image: string;
  rating: string;
  favorites: string;
  price: string;
  details: string;
}

const FoodDetailScreen: React.FC<Props> = ({ route, navigation }: Props) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.rating}>
          {item.rating} ({item.favorites} favorites)
        </Text>
        <Text style={styles.details}>{item.details}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    margin: 10,
  },
  backButtonText: {
    color: '#ff6347',
  },
  image: {
    width: '100%',
    height: 200,
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 10,
  },
  rating: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
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
