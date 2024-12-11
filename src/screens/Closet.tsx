// src/screens/Closet.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { removeBackground } from '../utils/removeBackground';
import { useClothes } from '../contexts/ClothesContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

type ClosetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Closet'>;
type ClosetRouteProp = RouteProp<RootStackParamList, 'Closet'>;

const categoryOrder = ['Hats', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

const Closet = () => {
  const { clothes, addClothingItem } = useClothes();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<ClosetNavigationProp>();
  const route = useRoute<ClosetRouteProp>();

  // Check if we came back from CategorySelectScreen
  useEffect(() => {
    const { chosenCategory, selectedImageUri } = route.params ?? {};
    if (chosenCategory && selectedImageUri) {
      onCategorySelect(chosenCategory, selectedImageUri);
      // Clear params after use
      navigation.setParams({ chosenCategory: undefined, selectedImageUri: undefined });
    }
  }, [route.params]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        navigation.navigate('CategorySelectScreen', { selectedImageUri: uri });
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const onCategorySelect = async (category: string, imageUri: string) => {
    setLoading(true);
    try {
      const { result_b64 } = await removeBackground(imageUri);
      const newItem = {
        id: Date.now().toString(),
        uri: result_b64,
        category,
        name: '',
        color: '',
        brand: '',
        price: '',
      };
      await addClothingItem(newItem);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const renderClothingItem = ({ item }: { item: { uri: string } }) => (
    <TouchableOpacity style={tw`p-2 rounded-lg bg-gray-800 shadow-lg m-2`}>
      <Image source={{ uri: item.uri }} style={tw`h-40 w-40 rounded-lg`} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: { category: string; items: any[] } }) => (
    <View style={tw`mb-1`}>
      <Text style={tw`text-white text-lg font-bold mb-1 px-4`}>{item.category}:</Text>
      {item.items.length > 0 ? (
        <FlatList
          horizontal
          data={item.items}
          renderItem={renderClothingItem}
          keyExtractor={(citem) => citem.uri}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={tw`h-40 items-center justify-center bg-gray-800 mx-4 rounded-lg`}>
          <Text style={tw`text-gray-400`}>No items added yet</Text>
        </View>
      )}
      <View style={styles.divider} />
    </View>
  );

  return (
    <View style={{ backgroundColor: '#121212', flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 80 }}>
        <Image
          source={require('../assets/splash.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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

      {loading && (
        <View style={tw`absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center`}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '90%',
    height: '90%',
    marginTop: 30,
  },
  divider: {
    height: 3,
    backgroundColor: '#2C2C2C',
    marginVertical: 10,
    marginHorizontal: 0,
  },
});

export default Closet;
