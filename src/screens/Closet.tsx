import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated, // Import Animated
  StyleSheet,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryModal from '../components/CategoryModal';
import { removeBackground } from '../utils/removeBackground';
import { useClothes } from '../contexts/ClothesContext';

const categoryOrder = ['Hats', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

const Closet = () => {
  const [loading, setLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const { clothes, addClothingItem } = useClothes();

  // Animated value for scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImageUri(result.assets[0].uri);
        setCategoryModalVisible(true); // Open modal immediately
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const onCategorySelect = async (category: string) => {
    if (!selectedImageUri) return;
    setLoading(true);
    try {
      const { result_b64 } = await removeBackground(selectedImageUri);
      const newItem = {
        id: Date.now().toString(),
        uri: result_b64,
        category,
        name: '',
        color: '',
        brand: '',
        price: '',
      };
      await addClothingItem(newItem); // Save to Firestore
    } catch (error) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setLoading(false);
      setCategoryModalVisible(false);
      setSelectedImageUri(null); // Reset image state
    }
  };

  const renderClothingItem = ({ item }: { item: { uri: string } }) => (
    <TouchableOpacity style={tw`p-2 rounded-lg bg-gray-800 shadow-lg m-2`}>
      <Image source={{ uri: item.uri }} style={tw`h-40 w-40 rounded-lg`} />
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: { category: string; items: any[] } }) => (
    <View style={tw`mb-1`}>
      <Text style={tw`text-white text-lg font-bold mb-1 px-4`}>{item.category}:</Text>
      {item.items.length > 0 ? (
        <Animated.FlatList
          horizontal
          data={item.items}
          renderItem={renderClothingItem}
          keyExtractor={(item) => item.uri}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View style={tw`h-40 items-center justify-center bg-gray-800 mx-4 rounded-lg`}>
          <Text style={tw`text-gray-400`}>No items added yet</Text>
        </View>
      )}
      {/* Divider */}
      <View style={styles.divider} />
    </View>
  );
  

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
    <View style={{ backgroundColor: '#121212', flex: 1 }}>
      {/* Animated Logo Section */}
      <Animated.View
        style={{
          height: logoHeight,
          opacity: logoOpacity,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('../assets/splash.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Spacer to move FlatList down */}
      <View style={{ height: 50 }} /> {/* Adjust height as needed */}

      {/* Main List */}
      <Animated.FlatList
        data={categoryOrder.map((category) => ({
          category,
          items: clothes.filter((item) => item.category === category),
        }))}
        renderItem={renderCategory}
        keyExtractor={(item) => item.category}
        contentContainerStyle={tw`p-4`}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Add Button */}
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg`}
        onPress={pickImage}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Category Modal */}
      <CategoryModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onCategorySelect={onCategorySelect}
        loading={loading}
      />

      {/* Loading Indicator */}
      {loading && (
        <View
          style={tw`absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center`}
        >
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: '90%',
    height: '90%',
    marginTop: 130,
  },
  divider: {
    height: 3, // Thickness of the line
    backgroundColor: '#2C2C2C', // Line color
    marginVertical: 10, // Spacing above and below the line
    marginHorizontal:0, // Indentation from left and right
  },
});

export default Closet;
