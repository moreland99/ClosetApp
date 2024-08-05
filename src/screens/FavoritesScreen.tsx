// src/screens/FavoritesScreen.tsx
import React from 'react';
import { View, ScrollView, Image, StyleSheet, Text } from 'react-native';
import { useClothes } from '../contexts/ClothesContext';
import { commonStyles } from '../styles/commonStyles';

const FavoritesScreen = () => {
  const { favorites } = useClothes();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {favorites.map((favorite, index) => (
        <View key={index} style={styles.favoriteContainer}>
          {favorite.map((item, itemIndex) => (
            <Image key={itemIndex} source={{ uri: item.uri }} style={styles.itemImage} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    padding: 20,
    alignItems: 'center',
  },
  favoriteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginHorizontal: 10,
  },
});
