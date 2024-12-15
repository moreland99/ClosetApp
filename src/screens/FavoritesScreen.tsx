import React, { useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useClothes } from '../contexts/ClothesContext';
import { MaterialIcons } from '@expo/vector-icons';
import { ClothingItem } from '../navigationTypes';

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const FavoritesScreen = () => {
  const { favorites, setFavorites } = useClothes();
  const [selectedFavorite, setSelectedFavorite] = useState<ClothingItem[] | null>(null);

  // Remove favorite
  const removeFavorite = (index: number) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  // Render Preview Card (Grid Layout)
  const renderFavoritePreview = ({ item, index }: { item: ClothingItem[]; index: number }) => (
    <View style={styles.previewCard}>
      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => removeFavorite(index)}>
        <MaterialIcons name="close" size={18} color="white" />
      </TouchableOpacity>

      {/* All Images (Max 6 Clothing Items) */}
      <View style={styles.previewImagesContainer}>
        {item.slice(0, 6).map((clothing, idx) => (
          <Image
            key={`${clothing.category}-${idx}`}
            source={{ uri: clothing.uri }}
            style={styles.previewImage}
          />
        ))}
      </View>

      <Text style={styles.previewLabel}>Favorite {index + 1}</Text>

      {/* Open Modal */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        onPress={() => setSelectedFavorite(item)}
      />
    </View>
  );

  // Full Favorite Modal View
  const renderFavoriteModal = ({ item }: { item: ClothingItem }) => (
    <View style={styles.modalItemContainer}>
      <Image source={{ uri: item.uri }} style={styles.modalImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>

      {/* Favorites Grid: 2 Cards Per Row */}
      <FlatList
        data={favorites}
        renderItem={renderFavoritePreview}
        keyExtractor={(item, index) => `favorite-${index}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="favorite-border" size={64} color="#555" />
            <Text style={styles.emptyText}>No favorites added yet!</Text>
          </View>
        }
      />

      {/* Modal: Full Favorite View */}
      <Modal visible={!!selectedFavorite} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <FlatList
            data={selectedFavorite || []}
            renderItem={renderFavoriteModal}
            keyExtractor={(item, index) => `${item.category}-${index}`}
            numColumns={2}
            contentContainerStyle={styles.modalGrid}
          />
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedFavorite(null)}>
            <MaterialIcons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  gridContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  previewCard: {
    width: width * 0.45, // 45% of screen width
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    margin: 8,
    padding: 8,
    alignItems: 'center',
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6949',
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  previewImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  previewImage: {
    width: '30%',
    height: 50,
    margin: 2,
    borderRadius: 4,
  },
  previewLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#777',
    fontSize: 16,
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 175,
  },
  modalGrid: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalItemContainer: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: width / 3, // Smaller images for modal grid
    height: width / 3,
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#FF5555',
    borderRadius: 50,
    padding: 10,
  },
});

export default FavoritesScreen;

