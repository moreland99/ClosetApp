// src/screens/ShuffleScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useClothes } from '../contexts/ClothesContext';
import { commonStyles } from '@styles/commonStyles';

const ShuffleScreen = () => {
  const { clothes } = useClothes();

  const randomItemsByCategory = clothes.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = item;
    }
    return acc;
  }, {} as { [key: string]: typeof clothes[0] });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shuffle Outfit</Text>
      {Object.values(randomItemsByCategory).map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Image source={{ uri: item.uri }} style={styles.itemImage} />
        </View>
      ))}
    </View>
  );
};

export default ShuffleScreen;

const styles = StyleSheet.create({
  ...commonStyles,
  itemContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  itemCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  itemImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
});
