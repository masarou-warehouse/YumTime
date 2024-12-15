import React, { useEffect, useState, useCallback } from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FIRESTORE } from '../config/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { FoodItem } from '../navigations/type';
import { useCart } from '../context/CartContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../navigations/type';

type HomeScreenNavigationProp = StackNavigationProp<StackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const foodsCollection = collection(FIRESTORE, 'foods');
    const q = query(foodsCollection, orderBy('name'), limit(50)); // Adjust limit as needed

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foodList: FoodItem[] = [];
      snapshot.forEach(doc => {
        foodList.push({
          id: doc.id,
          ...(doc.data() as Omit<FoodItem, 'id'>),
        });
      });
      setFoods(foodList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching foods:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = useCallback(({ item }: { item: FoodItem }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('FoodDetail', { item })}
    >
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
        <Text style={styles.itemRating}>
          ⭐ {item.rating} ({item.favorites})
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for any foods"
            placeholderTextColor="#888"
            value={search}
            onChangeText={setSearch}
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
      <Text style={styles.sectionTitle}>Most Popular</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#ff8c00" />
      ) : (
        <FlatList
          data={filteredFoods}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}
      {/* Best Choice Section */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.1, // For iOS
    shadowRadius: 5, // For iOS
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 10,
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
  itemRating: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
