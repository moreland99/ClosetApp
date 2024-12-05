import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ShuffleScreenRouteProp } from '../navigationTypes';
import { useClothes } from '../contexts/ClothesContext';
import { ClothingItem } from '../navigationTypes';

const ShuffleScreen = () => {
  const route = useRoute<ShuffleScreenRouteProp>();
  const { clothes, favorites, setFavorites } = useClothes();

  const [shuffledClothes, setShuffledClothes] = useState<{ [key: string]: ClothingItem }>(() => shuffleClothes(clothes));
  const [selectedCategory, setSelectedCategory] = useState('All');

  function shuffleClothes(clothes: ClothingItem[]): { [key: string]: ClothingItem } {
    const categories = ['Hat', 'Accessories', 'Jacket', 'Shirt', 'Pants', 'Shoes'];
    return categories.reduce((acc, category) => {
      const items = clothes.filter((item) => item.category === category);
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        acc[category] = randomItem;
      }
      return acc;
    }, {} as { [key: string]: ClothingItem });
  }

  const shuffleCategory = (category: string) => {
    const items = clothes.filter((item) => item.category === category);
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setShuffledClothes((prev) => ({ ...prev, [category]: randomItem }));
    }
  };

  const shuffleAgain = () => {
    if (selectedCategory === 'All') {
      setShuffledClothes(shuffleClothes(clothes));
    } else {
      shuffleCategory(selectedCategory);
    }
  };

  const saveToFavorites = () => {
    setFavorites([...favorites, Object.values(shuffledClothes)]);
  };

  const renderPlaceholderOutfit = () => {
    if (Object.keys(shuffledClothes).length === 0) {
      return (
        <Text style={tw`text-gray-400 text-center`}>
          No clothes available. Start adding items to shuffle your outfit!
        </Text>
      );
    }

    return (
      <View style={tw`flex flex-row flex-wrap justify-center`}>
        {Object.values(shuffledClothes).map((item) => (
          <View
            key={item.category}
            style={tw`bg-gray-800 rounded-lg shadow-md m-3 p-4 w-40 items-center`}
          >
            <Image source={{ uri: item.uri }} style={tw`h-36 w-36 rounded-md`} />
            <Text style={tw`text-white text-center mt-2 font-bold text-sm`}>
              {item.category}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#121212', flex: 1 }}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-between p-4`}>
        <Text style={tw`text-white text-2xl font-bold text-center mb-4`}>
          Your Shuffled Outfit
        </Text>

        {/* Placeholder for Outfit */}
        <View
          style={{
            height: '65%',
            backgroundColor: '#1E1E1E',
            borderRadius: 15,
            padding: 16,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {renderPlaceholderOutfit()}
        </View>

        {/* Shuffle Button */}
        <TouchableOpacity
          style={tw`bg-blue-600 p-4 rounded-lg shadow-lg mb-4`}
          onPress={shuffleAgain}
        >
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Shuffle {selectedCategory}
          </Text>
        </TouchableOpacity>

        {/* Save to Favorites Button */}
        <TouchableOpacity
          style={tw`bg-green-600 p-4 rounded-lg shadow-lg`}
          onPress={saveToFavorites}
        >
          <Text style={tw`text-white text-center text-lg font-bold`}>
            Save to Favorites
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShuffleScreen;