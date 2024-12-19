import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  TextInput, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Modal,
  ScrollView 
} from 'react-native';
import { FIRESTORE, FIREBASE_AUTH } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type FoodItem = {
  id: string;
  name: string;
  imagePath: string;
  rating: string;
  favorites: string;
  price: string;
  details: string;
};

type UserItem = {
  id: string;
  email: string;
  isAdmin: boolean;
};

type AdminMessageType = {
  type: 'success' | 'error';
  text: string;
} | null;

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
  
  // State for Admin Creation
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminMessage, setAdminMessage] = useState<AdminMessageType>(null);

  // State for User Management
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userMessage, setUserMessage] = useState<AdminMessageType>(null);

  // State for Editing Food
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [foodToEdit, setFoodToEdit] = useState<FoodItem | null>(null);
  const [editFoodData, setEditFoodData] = useState({
    name: '',
    imagePath: '',
    rating: '',
    favorites: '',
    price: '',
    details: '',
  });

  const currentUser = FIREBASE_AUTH.currentUser;

  // Verify Admin Access
  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(FIRESTORE, 'users', currentUser.uid));
        if (userDoc.exists()) {
          if (!userDoc.data().isAdmin) {
            Alert.alert('Access Denied', 'You do not have permission to access this screen.');
            // Optionally, navigate away, e.g., navigation.navigate('Home');
          }
        } else {
          Alert.alert('User Not Found', 'Your user profile does not exist.');
          // Optionally, navigate away
        }
      } else {
        Alert.alert('Not Authenticated', 'Please log in to access this screen.');
        // Optionally, navigate to Login
      }
    };

    fetchAdminStatus();
  }, [currentUser]);

  // Fetch Foods and Users
  useEffect(() => {
    const unsubscribeFoods = onSnapshot(collection(FIRESTORE, 'foods'), (snapshot) => {
      const foodsList: FoodItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<FoodItem, 'id'>,
      }));
      setFoods(foodsList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching foods:', error);
      setLoading(false);
    });

    const unsubscribeUsers = onSnapshot(collection(FIRESTORE, 'users'), (snapshot) => {
      const usersList: UserItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email,
        isAdmin: doc.data().isAdmin || false,
      }));
      setUsers(usersList);
      setUserLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setUserLoading(false);
    });

    return () => {
      unsubscribeFoods();
      unsubscribeUsers();
    };
  }, []);

  // Function to handle Admin Creation
  const handleCreateAdmin = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminMessage({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }

    setAdminLoading(true);
    setAdminMessage(null);

    try {
      // Create new user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, adminEmail.trim(), adminPassword.trim());
      const user = userCredential.user;

      // Update Firestore 'users' collection to set isAdmin = true
      await setDoc(doc(FIRESTORE, 'users', user.uid), {
        email: adminEmail.trim(),
        isAdmin: true,
        // Add other necessary fields as required
      }, { merge: true });

      setAdminMessage({ type: 'success', text: 'Admin account created successfully!' });
      setAdminEmail('');
      setAdminPassword('');
    } catch (error: any) {
      console.error('Error creating admin:', error);
      setAdminMessage({ type: 'error', text: error.message || 'An error occurred while creating the admin account.' });
    } finally {
      setAdminLoading(false);
    }
  };

  // Function to toggle admin status
  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?.uid) {
      Alert.alert('Operation Not Allowed', 'You cannot change your own admin status.');
      return;
    }

    try {
      await setDoc(doc(FIRESTORE, 'users', userId), {
        isAdmin: !currentStatus,
      }, { merge: true });
      setUserMessage({ type: 'success', text: 'User admin status updated successfully.' });
    } catch (error: any) {
      console.error('Error updating admin status:', error);
      setUserMessage({ type: 'error', text: error.message || 'Failed to update admin status.' });
    }
  };

  // Function to delete a user (Firestore document only)
  const deleteUserDoc = async (userId: string) => {
    if (userId === currentUser?.uid) {
      Alert.alert('Operation Not Allowed', 'You cannot delete your own account.');
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(FIRESTORE, 'users', userId));
              setUserMessage({ type: 'success', text: 'User deleted successfully.' });
            } catch (error: any) {
              console.error('Error deleting user:', error);
              setUserMessage({ type: 'error', text: error.message || 'Failed to delete user.' });
            }
          } 
        },
      ]
    );
  };

  // Function to handle Add Food
  const handleAddFood = async () => {
    const { name, imagePath, rating, favorites, price, details } = newFood;
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Food name is required.');
      return;
    }

    try {
      await addDoc(collection(FIRESTORE, 'foods'), {
        name: name.trim(),
        imagePath: imagePath.trim(),
        rating: rating.trim(),
        favorites: favorites.trim(),
        price: price.trim(),
        details: details.trim(),
      });
      Alert.alert('Success', 'Food added successfully.');
      setNewFood({
        name: '',
        imagePath: '',
        rating: '',
        favorites: '',
        price: '',
        details: '',
      });
    } catch (error: any) {
      console.error('Error adding food:', error);
      Alert.alert('Error', error.message || 'Failed to add food.');
    }
  };

  // Function to open Edit Modal
  const openEditModal = (food: FoodItem) => {
    setFoodToEdit(food);
    setEditFoodData({
      name: food.name,
      imagePath: food.imagePath,
      rating: food.rating,
      favorites: food.favorites,
      price: food.price,
      details: food.details,
    });
    setEditModalVisible(true);
  };

  // Function to handle Edit Food
  const handleEditFood = async () => {
    if (!foodToEdit) return;

    const { name, imagePath, rating, favorites, price, details } = editFoodData;
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Food name is required.');
      return;
    }

    try {
      await updateDoc(doc(FIRESTORE, 'foods', foodToEdit.id), {
        name: name.trim(),
        imagePath: imagePath.trim(),
        rating: rating.trim(),
        favorites: favorites.trim(),
        price: price.trim(),
        details: details.trim(),
      });
      Alert.alert('Success', 'Food updated successfully.');
      setEditModalVisible(false);
      setFoodToEdit(null);
    } catch (error: any) {
      console.error('Error updating food:', error);
      Alert.alert('Error', error.message || 'Failed to update food.');
    }
  };

  // Function to delete a food
  const deleteFood = async (foodId: string) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this food?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(FIRESTORE, 'foods', foodId));
              Alert.alert('Success', 'Food deleted successfully.');
            } catch (error: any) {
              console.error('Error deleting food:', error);
              Alert.alert('Error', error.message || 'Failed to delete food.');
            }
          } 
        },
      ]
    );
  };

  // Function to render each user item
  const renderUserItem = ({ item }: { item: UserItem }) => (
    <View style={styles.userItem}>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.isAdmin ? styles.demoteButton : styles.promoteButton]}
          onPress={() => toggleAdminStatus(item.id, item.isAdmin)}
        >
          <Text style={styles.actionText}>{item.isAdmin ? 'Demote' : 'Promote'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteUserDoc(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Function to render each food item
  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItem}>
      <Text style={styles.foodName}>{item.name}</Text>
      <View style={styles.foodActions}>
        <TouchableOpacity 
          style={[styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteFood(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Admin Panel</Text>

      {/* Admin Creation Section */}
      <View style={styles.adminSection}>
        <Text style={styles.sectionTitle}>Create New Admin</Text>
        
        {adminMessage && (
          <View style={[styles.messageBox, adminMessage.type === 'success' ? styles.success : styles.error]}>
            <Text style={styles.messageText}>{adminMessage.text}</Text>
          </View>
        )}

        <TextInput
          placeholder="Admin Email"
          value={adminEmail}
          onChangeText={setAdminEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Admin Password"
          value={adminPassword}
          onChangeText={setAdminPassword}
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity 
          style={[styles.button, adminLoading && styles.buttonDisabled]} 
          onPress={handleCreateAdmin}
          disabled={adminLoading}
        >
          {adminLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Admin</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* User Management Section */}
      <View style={styles.usersSection}>
        <Text style={styles.sectionTitle}>Manage Users</Text>
        
        {userMessage && (
          <View style={[styles.messageBox, userMessage.type === 'success' ? styles.success : styles.error]}>
            <Text style={styles.messageText}>{userMessage.text}</Text>
          </View>
        )}

        {userLoading ? (
          <ActivityIndicator size="large" color="#ff8c00" />
        ) : (
          <FlatList
            data={users}
            keyExtractor={item => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.usersList}
            ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
          />
        )}
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Foods Management Section */}
      <View style={styles.foodsSection}>
        <Text style={styles.sectionTitle}>Manage Foods</Text>
        
        {/* Add Food Form */}
        <View style={styles.addFoodContainer}>
          <Text style={styles.subSectionTitle}>Add New Food</Text>
          <TextInput
            placeholder="Name"
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
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Details"
            value={newFood.details}
            onChangeText={(text) => setNewFood({ ...newFood, details: text })}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleAddFood}
          >
            <Text style={styles.buttonText}>Add Food</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ff8c00" />
        ) : (
          <FlatList
            data={foods}
            keyExtractor={item => item.id}
            renderItem={renderFoodItem}
            contentContainerStyle={styles.foodsList}
            ListEmptyComponent={<Text style={styles.emptyText}>No foods found.</Text>}
          />
        )}
      </View>

      {/* Edit Food Modal */}
      {foodToEdit && (
        <Modal
          visible={editModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Food</Text>
              <TextInput
                placeholder="Name"
                value={editFoodData.name}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, name: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Image Path"
                value={editFoodData.imagePath}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, imagePath: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Rating"
                value={editFoodData.rating}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, rating: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Favorites"
                value={editFoodData.favorites}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, favorites: text })}
                style={styles.input}
              />
              <TextInput
                placeholder="Price"
                value={editFoodData.price}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, price: text })}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Details"
                value={editFoodData.details}
                onChangeText={(text) => setEditFoodData({ ...editFoodData, details: text })}
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.button, styles.saveButton]} 
                  onPress={handleEditFood}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  adminSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  messageBox: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  success: {
    backgroundColor: '#d4edda',
  },
  error: {
    backgroundColor: '#f8d7da',
  },
  messageText: {
    color: '#155724',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    height: 80,
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginLeft: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ffa366',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },
  usersSection: {
    flex: 1,
  },
  usersList: {
    paddingBottom: 20,
  },
  userItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff8c00',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  promoteButton: {
    backgroundColor: '#28a745',
  },
  demoteButton: {
    backgroundColor: '#dc3545',
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 16,
  },
  foodItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff8c00',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  foodActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addFoodContainer: {
    marginBottom: 20,
  },
  foodsSection: {
    flex: 1,
    marginTop: 10,
  },
  foodsList: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default AdminScreen;