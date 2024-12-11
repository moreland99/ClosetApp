import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { ShuffleScreenRouteProp } from '../navigationTypes';
import { useClothes } from '../contexts/ClothesContext';
import { ClothingItem } from '../navigationTypes';
import { MaterialIcons } from '@expo/vector-icons';

const ShuffleScreen = () => {
  const route = useRoute<ShuffleScreenRouteProp>();
  const { clothes, favorites, setFavorites } = useClothes();

  const [shuffledClothes, setShuffledClothes] = useState<{ [key: string]: ClothingItem }>(() => shuffleClothes(clothes));
  const [selectedCategory, setSelectedCategory] = useState('All');

// Animated value for scroll position
const scrollY = useRef(new Animated.Value(0)).current;

  // Animated value for the "Saved" message
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showToast = () => {
    // Fade in the message
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Fade out after a delay
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 1500); // Message stays for 1.5 seconds
    });
  };

  function shuffleClothes(clothes: ClothingItem[]): { [key: string]: ClothingItem } {
    const categories = ['Hats', 'Accessories', 'Jackets', 'Shirts', 'Pants', 'Shoes'];
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
    showToast(); // Trigger the toast message
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
      <View style={styles.outfitContainer}>
        {Object.entries(shuffledClothes).map(([category, item]) => (
          <View key={category} style={styles.card}>
            <Image
              source={{ uri: item.uri }}
              style={styles.cardImage}
            />
          </View>
        ))}
      </View>
    );
  };

  // Animate the logo panel disappearing as you scroll
  const logoOpacity = scrollY.interpolate({
    inputRange: [0, 150], // Range of scroll
    outputRange: [1, 0], // Fully visible to invisible
    extrapolate: 'clamp', // Clamp values between 0 and 1
  });

  const logoHeight = scrollY.interpolate({
    inputRange: [0, 150], // Range of scroll
    outputRange: [80, 0], // Shrink height to 0
    extrapolate: 'clamp', // Clamp values between 0 and 80
  });


  return (
    <SafeAreaView style={{ backgroundColor: '#121212', flex: 1 }}>
        {/* Logo Section */}
        <Animated.View
  style={{
    height: logoHeight,
    opacity: logoOpacity,
    alignItems: 'center',
    justifyContent: 'center', // Aligns it to the same vertical placement
  }}
>
  <Image
    source={require('../assets/splash.png')}
    style={styles.logo}
    resizeMode="contain"
  />
</Animated.View>

        <Text style={styles.title}>
          Shuffle Outfits
        </Text>

        {/* Placeholder for Outfit */}
        <View
          style={{
            height: '65%',
            borderRadius: 15,
            padding: 16,
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {renderPlaceholderOutfit()}
        </View>

        {/* Icon Buttons Section */}
        <View style={styles.iconButtonContainer}>
          {/* Shuffle Icon */}
          <TouchableOpacity
            onPress={shuffleAgain}
            style={styles.iconButton}
          >
            <MaterialIcons name="shuffle" size={45} color="white" />
          </TouchableOpacity>

          {/* Heart Icon */}
          <TouchableOpacity
            onPress={saveToFavorites}
            style={styles.iconButton}
          >
            <MaterialIcons name="favorite" size={45} color="#db2727" />
          </TouchableOpacity>
        </View>

      {/* Animated Toast Message */}
      <Animated.View
        style={[
          styles.toastMessage,
          { opacity: fadeAnim }, // Bind opacity to fade animation
        ]}
      >
        <Text style={styles.toastText}>Outfit Saved!</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outfitContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  card: {
    width: '45%',
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  iconButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconButton: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toastMessage: {
    position: 'absolute',
    top: 150, // Adjust position above the bottom buttons
    alignSelf: 'center',
    backgroundColor: '#4ab751',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 1,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    width: '90%',
    height: '90%',
    marginTop: 11,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
    marginTop: 16,
    alignSelf: 'center',
  },
});

export default ShuffleScreen;
