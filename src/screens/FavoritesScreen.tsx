import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { useClothes } from '../contexts/ClothesContext';
import { MaterialIcons } from '@expo/vector-icons';
import { ClothingItem } from '../navigationTypes';

const FavoritesScreen = () => {
  const { favorites, setFavorites } = useClothes();

  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const renderFavorite = ({ item, index }: { item: ClothingItem[], index: number }) => (
    <View key={index} style={tw`mb-6`}>
      <Text style={tw`text-lg font-bold text-white mb-2 px-4`}>
        Favorite {index + 1}
      </Text>
      <FlatList
        data={item}
        renderItem={({ item }) => (
          <View style={tw`bg-gray-800 rounded-lg shadow-md m-2 p-2`}>
            <Image source={{ uri: item.uri }} style={tw`h-40 w-40 rounded-md`} />
            <Text style={tw`text-white text-center mt-2 text-sm font-bold`}>
              {item.category}
            </Text>
          </View>
        )}
        keyExtractor={(item, idx) => `${item.category}-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-2`}
      />
      <TouchableOpacity
        onPress={() => removeFavorite(index)}
        style={tw`bg-red-600 p-2 rounded-lg self-center mt-4 shadow-lg`}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ backgroundColor: '#121212', flex: 1, paddingTop: 16 }}>
      <Text style={tw`text-white text-2xl font-bold text-center mb-4`}>
        Favorites
      </Text>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item, index) => `favorite-${index}`}
        contentContainerStyle={tw`pb-16`}
        ListEmptyComponent={
          <Text style={tw`text-gray-400 text-center mt-20`}>
            No favorites added yet. Start saving outfits!
          </Text>
        }
      />
    </View>
  );
};

export default FavoritesScreen;
