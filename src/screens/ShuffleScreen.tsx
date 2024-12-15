import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClothes } from '../contexts/ClothesContext';
import { ClothingItem } from '../navigationTypes';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const categories = ['Hats', 'Accessories', 'Jackets', 'Shirts', 'Pants', 'Shoes'];

const ShuffleScreen = () => {
  const { clothes, favorites, setFavorites } = useClothes();

  const [shuffledClothes, setShuffledClothes] = useState<{ [key: string]: ClothingItem }>(
    () => shuffleClothes(clothes)
  );
  const [excludedCategories, setExcludedCategories] = useState<string[]>([]);
  const [pausedCategories, setPausedCategories] = useState<string[]>([]);
  const [infoVisible, setInfoVisible] = useState(false); // Controls modal visibility
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Toast Message
  const showToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500);
    });
  };

  // Shuffle Clothes Logic
  function shuffleClothes(clothes: ClothingItem[]): { [key: string]: ClothingItem } {
    return categories.reduce((acc, category) => {
      const items = clothes.filter((item) => item.category === category);
      if (items.length > 0) {
        acc[category] = items[Math.floor(Math.random() * items.length)];
      }
      return acc;
    }, {} as { [key: string]: ClothingItem });
  }

  const shuffleAgain = () => {
    setShuffledClothes((prev) => {
      const newShuffled = { ...prev };

      categories.forEach((category) => {
        if (!pausedCategories.includes(category) && !excludedCategories.includes(category)) {
          const items = clothes.filter((item) => item.category === category);
          if (items.length > 0) {
            newShuffled[category] = items[Math.floor(Math.random() * items.length)];
          }
        }
      });

      return newShuffled;
    });
  };

  const toggleExcludeCategory = (category: string) => {
    setExcludedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const resetCategories = () => {
    setExcludedCategories([]);
  };

  const togglePauseCategory = (category: string) => {
    setPausedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const saveToFavorites = () => {
    const currentOutfit = Object.entries(shuffledClothes)
      .filter(([category]) => !excludedCategories.includes(category))
      .map(([, item]) => item);

    setFavorites((prevFavorites) => [...prevFavorites, currentOutfit]);
    showToast();
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#121212', flex: 1 }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Shuffle Outfits</Text>
        <TouchableOpacity onPress={() => setInfoVisible(true)} style={styles.infoButton}>
          <MaterialIcons name="info-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Outfit Grid */}
      <View style={styles.cardGrid}>
        {categories.map((category) => {
          if (excludedCategories.includes(category)) return null;

          const item = shuffledClothes[category];
          return (
            <TouchableOpacity
              key={category}
              style={styles.card}
              onPress={() => togglePauseCategory(category)}
            >
              {item ? (
                <>
                  <Image source={{ uri: item.uri }} style={styles.cardImage} resizeMode="contain" />
                  {pausedCategories.includes(category) && (
                    <View style={styles.overlay}>
                      <MaterialIcons name="pause" size={48} color="rgba(255,255,255,0.6)" />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => toggleExcludeCategory(category)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF6949" />
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.noItemText}>No items</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>How This Page Works</Text>
            <Text style={styles.modalText}>
              - **Shuffle**: Randomly selects items for each category.{'\n'}
              - **Pause**: Tap a card to keep that category static.{'\n'}
              - **Remove**: Click the close button (X) to hide a category.{'\n'}
              - **Save**: Save your current shuffle to favorites.
            </Text>
            <TouchableOpacity onPress={() => setInfoVisible(false)} style={styles.closeModalButton}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Action Buttons */}
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity onPress={shuffleAgain} style={styles.iconButton}>
          <MaterialIcons name="shuffle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveToFavorites} style={styles.iconButton}>
          <MaterialIcons name="favorite" size={30} color="#db2727" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  infoButton: { padding: 8 },
  resetButton: {
    backgroundColor: '#222222',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  resetText: { color: '#FFF', fontWeight: 'bold' },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    flexGrow: 1,
  },
  card: {
    width: '47%',
    aspectRatio: 1, // Proportional square
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 0,
    textAlign: 'center',
  },
  noItemText: { color: '#A9A9A9', fontSize: 14, textAlign: 'center' },
  removeButton: { position: 'absolute', top: 4, right: 4 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  iconButton: {
    backgroundColor: '#1E1E1E',
    padding: 15, // Increase padding
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  toastMessage: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#4AB751',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  toastText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 10,
  },
  closeModalButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF5555',
    padding: 8,
    borderRadius: 5,
  },
  closeModalText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ShuffleScreen;