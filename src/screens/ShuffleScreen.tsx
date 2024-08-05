import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ShuffleScreenRouteProp } from '../navigationTypes';
import { useClothes } from '../contexts/ClothesContext';
import { commonStyles } from '../styles/commonStyles';
import { ClothingItem } from '../navigationTypes';

const ShuffleScreen = () => {
  const route = useRoute<ShuffleScreenRouteProp>();
  const { clothes, favorites, setFavorites } = useClothes();

  const [shuffledClothes, setShuffledClothes] = useState<{ [key: string]: ClothingItem }>(() => shuffleClothes(clothes));
  const [selectedCategory, setSelectedCategory] = useState('All');

  function shuffleClothes(clothes: ClothingItem[]): { [key: string]: ClothingItem } {
    const categories = ['Hat', 'Accessories', 'Jacket', 'Shirt', 'Pants', 'Shoes'];
    return categories.reduce((acc, category) => {
      const items = clothes.filter(item => item.category === category);
      if (items.length > 0) {
        const randomItem = items[Math.floor(Math.random() * items.length)];
        acc[category] = randomItem;
      }
      return acc;
    }, {} as { [key: string]: ClothingItem });
  }

  const shuffleCategory = (category: string) => {
    const items = clothes.filter(item => item.category === category);
    if (items.length > 0) {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setShuffledClothes(prev => ({ ...prev, [category]: randomItem }));
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

  const renderItem = (item: ClothingItem) => (
    <TouchableOpacity key={item.category} style={styles.itemContainer} onPress={() => shuffleCategory(item.category)}>
      <Image source={{ uri: item.uri }} style={styles.itemImage} />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowContainer}>
        {shuffledClothes.Hat && renderItem(shuffledClothes.Hat)}
        {shuffledClothes.Accessories && renderItem(shuffledClothes.Accessories)}
      </View>
      <View style={styles.rowContainer}>
        {shuffledClothes.Jacket && renderItem(shuffledClothes.Jacket)}
        {shuffledClothes.Shirt && renderItem(shuffledClothes.Shirt)}
      </View>
      {shuffledClothes.Pants && renderItem(shuffledClothes.Pants)}
      {shuffledClothes.Shoes && renderItem(shuffledClothes.Shoes)}
      <TouchableOpacity style={styles.shuffleButton} onPress={shuffleAgain}>
        <Text style={styles.shuffleButtonText}>Shuffle {selectedCategory}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={saveToFavorites}>
        <Text style={styles.saveButtonText}>Save to Favorites</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ShuffleScreen;

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    padding: 20,
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    marginHorizontal: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  shuffleButton: {
    backgroundColor: 'tomato',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  shuffleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
