// src/screens/Closet.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
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
      setModalVisible(true);
    }
  };

  const onCategorySelect = async (category: string) => {
    if (!selectedImageUri) {
      console.error('No image selected');
      return;
    }

    setLoading(true);
    console.log('Selected Image URI:', selectedImageUri);

    try {
      const bgRemoved = await removeBackground(selectedImageUri);
      const newClothes = [...clothes, { uri: bgRemoved.result_b64, category }];
      newClothes.sort((a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category));
      setClothes(newClothes);
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
      setModalVisible(false);
    }
  };

  const removeClothingItem = (category: string, index: number) => {
    const newClothes = clothes.filter((item, i) => !(item.category === category && i === index));
    setClothes(newClothes);
  };

  const groupClothesByCategory = () => {
    return categoryOrder.map(category => ({
      category,
      items: clothes.filter(item => item.category === category),
    }));
  };

  const renderCategory = ({ item }: { item: { category: string, items: ClothingItem[] } }) => (
    <View key={item.category} style={styles.categoryContainer}>
      <Text style={styles.categoryTitle}>{item.category}</Text>
      <FlatList
        data={item.items}
        renderItem={({ item, index }) => (
          <View style={styles.clothingItem}>
            <Image source={{ uri: item.uri }} style={styles.clothingImage} />
            <TouchableOpacity onPress={() => removeClothingItem(item.category, index)} style={styles.removeButton}>
              <MaterialIcons name="remove-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `${item.category}-${index}`}
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
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
  flatList: {
    flex: 1,
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
    marginBottom: 10,
  },
  horizontalList: {
    paddingLeft: 10,
  },
  clothingItem: {
    marginRight: 10,
    alignItems: 'center',
  },
  clothingImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
