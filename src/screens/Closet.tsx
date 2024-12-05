import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CategoryModal from '../components/CategoryModal';
import { removeBackground } from '../utils/removeBackground';
import { useClothes } from '../contexts/ClothesContext';
import { ShuffleScreenNavigationProp, ClothingItem } from '../navigationTypes';

const STORAGE_KEY = '@clothes';
const categoryOrder = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

const Closet = () => {
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [newClothingItem, setNewClothingItem] = useState({ name: '', color: '', brand: '', price: '' });
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const { clothes, setClothes } = useClothes();
  const navigation = useNavigation<ShuffleScreenNavigationProp>();

  // Load and Save Clothes to AsyncStorage
  useEffect(() => {
    (async () => {
      const storedClothes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedClothes) setClothes(JSON.parse(storedClothes));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(clothes)).catch((error) =>
      console.error('Failed to save clothes to storage:', error)
    );
  }, [clothes]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setSelectedImageUri(result.assets[0].uri);
      setCategoryModalVisible(true);
    }
  };

  const onCategorySelect = useCallback(
    async (category: string) => {
      if (!selectedImageUri) return;
      setLoading(true);
      try {
        const { result_b64 } = await removeBackground(selectedImageUri);
        const newClothes = [
          ...clothes,
          { ...newClothingItem, uri: result_b64, category },
        ].sort(
          (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
        );
        setClothes(newClothes);
        setNewClothingItem({ name: '', color: '', brand: '', price: '' });
      } catch (error) {
        console.error('Error removing background:', error);
      } finally {
        setLoading(false);
        setCategoryModalVisible(false);
      }
    },
    [clothes, selectedImageUri, newClothingItem]
  );

  const removeClothingItem = (itemUri: string) => {
    setClothes((prevClothes) => prevClothes.filter((item) => item.uri !== itemUri));
  };

  const groupClothesByCategory = useCallback(
    () =>
      categoryOrder.map((category) => ({
        category,
        items: clothes.filter((item) => item.category === category),
      })),
    [clothes]
  );

  const saveItemDetails = () => {
    if (selectedItem) {
      setClothes((prevClothes) =>
        prevClothes.map((item) =>
          item.uri === selectedItem.uri ? selectedItem : item
        )
      );
      setSelectedItem(null);
    }
  };

  const renderClothingItem = ({ item }: { item: ClothingItem }) => (
    <TouchableOpacity
      style={styles.clothingItem}
      onPress={() => setSelectedItem(item)}
    >
      <Image source={{ uri: item.uri }} style={styles.clothingImage} />
      {selectedItem?.uri === item.uri && (
        <View>
{['name', 'color', 'brand', 'price'].map((field) => (
  <TextInput
    key={field}
    style={styles.itemLabel}
    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
    placeholderTextColor="#999"
    value={(selectedItem as any)[field] || ''} // Provide a default value
    onChangeText={(text) =>
      setSelectedItem((prev) => {
        if (!prev) return null;
        return { ...prev, [field]: text || '' }; // Ensure all fields are strings
      })
    }
  />
))}

          <TouchableOpacity onPress={saveItemDetails} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => removeClothingItem(item.uri)}
            style={styles.removeButton}
          >
            <MaterialIcons name="delete" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: { category: string; items: ClothingItem[] } }) => (
    <View key={item.category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.items}
        renderItem={renderClothingItem}
        keyExtractor={(item) => item.uri}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Closet</Text>
      <FlatList
        data={groupClothesByCategory()}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
      />
      <TouchableOpacity style={styles.addButton} onPress={pickImage}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.shuffleButton}
        onPress={() => navigation.navigate('Shuffle', { clothes })}
      >
        <MaterialIcons name="shuffle" size={24} color="white" />
      </TouchableOpacity>
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategorySelect={onCategorySelect}
      />
      {loading && (
        <Modal transparent>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default Closet;

// Styles are unchanged

const styles = StyleSheet.create({
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
