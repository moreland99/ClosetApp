import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CategoryModal from '../components/CategoryModal';
import { removeBackground } from '../utils/removeBackground';
import { commonStyles } from '../styles/commonStyles';
import axios from 'axios';
import { useClothes } from '../contexts/ClothesContext';
import { ShuffleScreenNavigationProp, ClothingItem } from '../navigationTypes';

const categoryOrder = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

const STORAGE_KEY = '@clothes';

const Closet = () => {
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [newClothingItem, setNewClothingItem] = useState({ name: '', color: '', brand: '', price: '' });
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { clothes, setClothes } = useClothes();
  const navigation = useNavigation<ShuffleScreenNavigationProp>();

  useEffect(() => {
    loadClothes();
  }, []);

  useEffect(() => {
    saveClothes();
  }, [clothes]);

  const loadClothes = async () => {
    try {
      const storedClothes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedClothes) {
        setClothes(JSON.parse(storedClothes));
      }
    } catch (error) {
      console.error('Failed to load clothes from storage:', error);
    }
  };

  const saveClothes = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clothes));
    } catch (error) {
      console.error('Failed to save clothes to storage:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImageUri(selectedAsset.uri);
      setCategoryModalVisible(true);
    }
  };

  const onCategorySelect = async (category: string) => {
    if (!selectedImageUri) {
      console.error('No image selected');
      return;
    }

    setLoading(true);

    try {
      const bgRemoved = await removeBackground(selectedImageUri);
      const newClothes = [...clothes, { ...newClothingItem, uri: bgRemoved.result_b64, category }];
      newClothes.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
      setClothes(newClothes);
      setNewClothingItem({ name: '', color: '', brand: '', price: '' });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error response data:', error.response?.data);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
      setCategoryModalVisible(false);
    }
  };

  const confirmDelete = (itemUri: string) => {
    console.log('Confirm delete called with URI:', itemUri);
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => removeClothingItem(itemUri) }
      ]
    );
  };
  

  const removeClothingItem = (itemUri: string) => {
    console.log('Remove clothing item called with URI:', itemUri);
    setClothes(prevClothes => {
      const newClothes = prevClothes.filter(item => item.uri !== itemUri);
      console.log('Updated clothes after deletion:', newClothes);
      return newClothes;
    });
  };
  
  const groupClothesByCategory = () => {
    return categoryOrder.map(category => ({
      category,
      items: clothes.filter(item => item.category === category),
    }));
  };

  const openEditModal = (item: ClothingItem) => {
    setSelectedItem(item);
    setIsEditing(true);
  };

  const saveItemDetails = () => {
    if (selectedItem) {
      const updatedClothes = clothes.map(item =>
        item.uri === selectedItem.uri ? selectedItem : item
      );
      setClothes(updatedClothes);
      setSelectedItem(null);
      setIsEditing(false);
    }
  };

  const renderCategory = ({ item }: { item: { category: string, items: ClothingItem[] } }) => (
    <View key={item.category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.items}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.clothingItem} onPress={() => openEditModal(item)}>
            <Image source={{ uri: item.uri }} style={styles.clothingImage} />
            {selectedItem?.uri === item.uri && (
              <View>
                <TextInput
                  style={styles.itemLabel}
                  placeholder="Name"
                  placeholderTextColor="#999"
                  value={selectedItem.name}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, name: text })}
                />
                <TextInput
                  style={styles.itemLabel}
                  placeholder="Color"
                  placeholderTextColor="#999"
                  value={selectedItem.color}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, color: text })}
                />
                <TextInput
                  style={styles.itemLabel}
                  placeholder="Brand"
                  placeholderTextColor="#999"
                  value={selectedItem.brand}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, brand: text })}
                />
                <TextInput
                  style={styles.itemLabel}
                  placeholder="Price"
                  placeholderTextColor="#999"
                  value={selectedItem.price}
                  onChangeText={(text) => setSelectedItem({ ...selectedItem, price: text })}
                />
                <TouchableOpacity onPress={saveItemDetails} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(item.uri)} style={styles.removeButton}>
                  <MaterialIcons name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${item.uri}-${index}`} // Ensure unique key
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalList}
      />
    </View>
  );
  

  const navigateToShuffle = () => {
    navigation.navigate('Shuffle', { clothes });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Closet</Text>
      <FlatList
        data={groupClothesByCategory()}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.shuffleButton} onPress={navigateToShuffle}>
        <MaterialIcons name="shuffle" size={24} color="white" />
      </TouchableOpacity>
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategorySelect={onCategorySelect}
      />
      {loading && (
        <Modal transparent={true}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Closet;

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // Light text
    textAlign: 'center',
    marginVertical: 20,
  },
  flatList: {
    flex: 1,
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff', // Light text
    marginLeft: 10,
    marginBottom: 10,
  },
  horizontalList: {
    paddingLeft: 10,
  },
  clothingItem: {
    marginRight: 10,
    alignItems: 'center',
    backgroundColor: '#1f1f1f', // Slightly lighter than the background
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 10,
    marginBottom: 10,
  },
  clothingImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemLabel: {
    color: '#ffffff', // Light text
    fontSize: 14,
    marginVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: '#333', // Dark background
    borderRadius: 5,
    padding: 5,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff', // Light text
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007BFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  shuffleButton: {
    backgroundColor: 'tomato',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 90,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
