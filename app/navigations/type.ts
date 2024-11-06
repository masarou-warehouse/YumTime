export type StackParamList = {
    Home: undefined;
    FoodDetail: { item: FoodItem };
    Login: undefined;
    Cart: undefined;
    Profile: undefined;
};
  
export interface FoodItem {
    name: string;
    image: string;
    rating: string;
    favorites: string;
    price: string;
    details: string;
}