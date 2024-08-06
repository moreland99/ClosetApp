import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { useClothes } from '../contexts/ClothesContext';
import { commonStyles } from '../styles/commonStyles';
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderFavorite}
        keyExtractor={(item, index) => `favorite-${index}`}
        contentContainerStyle={styles.flatListContent}
      />
    </ScrollView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  ...commonStyles,
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background
  },
  favoriteContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1f1f1f', // Slightly lighter than the background
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff', // Light text
    marginBottom: 10,
  },
  itemContainer: {
    marginHorizontal: 10,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
  },
  removeButtonText: {
    color: '#ffffff', // Light text
    fontSize: 16,
  },
  flatListContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  horizontalFlatListContent: {
    alignItems: 'center',
  },
});
