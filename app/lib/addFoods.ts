// addFoods.ts
import { FIRESTORE } from '../config/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

type FoodItem = {
  name: string;
  image: string;
  rating: string;
  favorites: string;
  price: string;
  details: string;
};

const foods: FoodItem[] = [
  {
    name: 'Cheese Vegetable Pizza',
    image: 'https://example.com/cheese-vegetable-pizza.jpg',
    rating: '5.0',
    favorites: '1.2k',
    price: '239,000 đ',
    details: 'Delicious cheese vegetable pizza with fresh ingredients...',
  },
  {
    name: 'Spicy Chicken Burger',
    image: 'https://example.com/spicy-chicken-burger.jpg',
    rating: '4.5',
    favorites: '900',
    price: '159,000 đ',
    details: 'Juicy spicy chicken burger with fresh lettuce and sauce...',
  },
];

const addFoodsToFirestore = async () => {
  const foodsCollection = collection(FIRESTORE, 'foods');
  
  for (const food of foods) {
    try {
      // Check if the food already exists
      const q = query(foodsCollection, where('name', '==', food.name));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await addDoc(foodsCollection, food);
        console.log(`Added: ${food.name}`);
      } else {
        console.log(`Food already exists: ${food.name}`);
      }
    } catch (error) {
      console.error('Error adding food:', error);
    }
  }
};

addFoodsToFirestore();