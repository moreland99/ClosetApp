import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useClothes } from '../contexts/ClothesContext';
import { ClothingItem } from '../navigationTypes';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '../firebase/firebaseConfig';

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
    setExcludedCategories([]); // Reset all excluded categories
  };

  const togglePauseCategory = (category: string) => {
    setPausedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const saveToFavorites = async () => {
    const currentOutfit = Object.entries(shuffledClothes)
      .filter(([category]) => !excludedCategories.includes(category))
      .map(([, item]) => ({
        id: item?.id || Date.now().toString(),
        uri: item?.uri || '',
        category: item?.category || '',
        name: item?.name || '',
        color: item?.color || '',
        brand: item?.brand || '',
        price: item?.price || '',
      }));

    try {
      const favoritesCollection = collection(FIREBASE_FIRESTORE, 'favorites');
      const docRef = await addDoc(favoritesCollection, {
        outfit: currentOutfit,
        createdAt: serverTimestamp(),
      });

      console.log('Favorite outfit successfully saved to Firestore:', docRef.id);
      setFavorites((prevFavorites) => [...prevFavorites, currentOutfit]);
      showToast();
    } catch (error) {
      console.error('Error saving favorite outfit to Firestore:', error);
      Alert.alert('Error', 'Failed to save favorite outfit.');
    }
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

      {/* Action Buttons */}
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity onPress={shuffleAgain} style={styles.iconButton}>
          <MaterialIcons name="shuffle" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={saveToFavorites} style={styles.iconButton}>
          <MaterialIcons name="favorite" size={30} color="#db2727" />
        </TouchableOpacity>
      </View>

      {/* Reset Button */}
      {excludedCategories.length > 0 && (
  <TouchableOpacity onPress={resetCategories} style={styles.resetButton}>
    <Text style={styles.resetText}>Show All Categories</Text>
  </TouchableOpacity>
)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  infoButton: { padding: 8 },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    marginBottom: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: { position: 'absolute', top: 4, right: 4 },
  resetButton: {
    backgroundColor: '#db2727',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  resetText: { color: '#FFF', fontWeight: 'bold' },
  iconButtonContainer: { flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 8 },
  iconButton: {
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 50,
  },
  noItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ShuffleScreen;
