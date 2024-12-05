import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useClothes } from '../contexts/ClothesContext';
import { theme } from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { ClothingItem } from '../navigationTypes';

const FavoritesScreen = () => {
  const { favorites, setFavorites } = useClothes();

  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  const renderFavorite = ({ item, index }: { item: ClothingItem[], index: number }) => (
    <View key={index} style={styles.favoriteContainer}>
      <Text style={styles.favoriteTitle}>Favorite {index + 1}</Text>
      <FlatList
        data={item}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.uri }} style={styles.itemImage} />
          </View>
        )}
        keyExtractor={(item, idx) => `${item.category}-${idx}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalFlatListContent}
      />
      <TouchableOpacity onPress={() => removeFavorite(index)} style={styles.removeButton}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={favorites}
      renderItem={renderFavorite}
      keyExtractor={(item, index) => `favorite-${index}`}
      contentContainerStyle={styles.flatListContent}
      ListHeaderComponent={<Text style={styles.title}>Favorites</Text>} // Add header
    />
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  favoriteContainer: {
    marginBottom: 16,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemContainer: {
    marginRight: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  horizontalFlatListContent: {
    paddingHorizontal: 8,
  },
  removeButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
});
