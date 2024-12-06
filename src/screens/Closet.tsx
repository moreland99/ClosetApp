import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryModal from '../components/CategoryModal';
import { removeBackground } from '../utils/removeBackground';
import { useClothes } from '../contexts/ClothesContext';

const categoryOrder = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

const Closet = () => {
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const { clothes, addClothingItem } = useClothes();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
        setCategoryModalVisible(true); // Open modal immediately
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const onCategorySelect = async (category: string) => {
    if (!selectedImageUri) return;
    setLoading(true);
    try {
      const { result_b64 } = await removeBackground(selectedImageUri);
      const newItem = {
        id: Date.now().toString(),
        uri: result_b64,
        category,
        name: '',
        color: '',
        brand: '',
        price: '',
      };
      await addClothingItem(newItem); // Save to Firestore
    } catch (error) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setLoading(false);
      setCategoryModalVisible(false);
      setSelectedImageUri(null); // Reset image state
    }
  };

  const renderClothingItem = ({ item }: { item: { uri: string } }) => (
    <TouchableOpacity style={tw`p-2 rounded-lg bg-gray-800 shadow-lg m-2`}>
      <Image source={{ uri: item.uri }} style={tw`h-40 w-40 rounded-lg`} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: { category: string; items: any[] } }) => (
    <View style={tw`mb-6`}>
      <Text style={tw`text-white text-lg font-bold mb-3 px-4`}>{item.category}</Text>
      {item.items.length > 0 ? (
        <FlatList
          horizontal
          data={item.items}
          renderItem={renderClothingItem}
          keyExtractor={(item) => item.uri}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={tw`h-40 items-center justify-center bg-gray-800 mx-4 rounded-lg`}>
          <Text style={tw`text-gray-400`}>No items added yet</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ backgroundColor: '#121212', flex: 1 }}>
      <FlatList
        data={categoryOrder.map((category) => ({
          category,
          items: clothes.filter((item) => item.category === category),
        }))}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
        contentContainerStyle={tw`p-4`}
      />
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg`}
        onPress={pickImage}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategorySelect={onCategorySelect}
        loading={loading}
      />
      {loading && (
        <View
          style={tw`absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </View>
  );
};

export default Closet;
