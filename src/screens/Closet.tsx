import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Animated,
  ScrollView,
  RefreshControl,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { removeBackground } from '../utils/removeBackground';
import { useClothes } from '../contexts/ClothesContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigationTypes';

type ClosetNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Closet'>;
type ClosetRouteProp = RouteProp<RootStackParamList, 'Closet'>;

const categoryOrder = ['Hats', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

const Closet = () => {
  const { clothes, addClothingItem } = useClothes();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<ClosetNavigationProp>();
  const route = useRoute<ClosetRouteProp>();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Handle params passed back from CategorySelectScreen
  useEffect(() => {
    const { chosenCategory, selectedImageUri } = route.params ?? {};
    if (chosenCategory && selectedImageUri) {
      onCategorySelect(chosenCategory, selectedImageUri);
      // Clear the params explicitly
      navigation.setParams({ chosenCategory: undefined, selectedImageUri: undefined });
    }
  }, [route.params]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const uri = result.assets[0].uri;
        navigation.navigate('CategorySelectScreen', { selectedImageUri: uri });
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const onCategorySelect = async (category: string, imageUri: string) => {
    setLoading(true);
    try {
      const { result_b64 } = await removeBackground(imageUri);
      const newItem = {
        id: Date.now().toString(),
        uri: result_b64,
        category,
        name: '',
        color: '',
        brand: '',
        price: '',
      };
      await addClothingItem(newItem);
    } catch (error) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderClothingItem = ({ item }: { item: { uri: string } }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <Image source={{ uri: item.uri }} style={styles.itemImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }} edges={['top']}>
      {/* Scrollable Content */}
      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={['#4A90E2']}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image source={require('../assets/splash.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>FittedFiles</Text>
        </View>

        {/* Categories */}
        {categoryOrder.map((category) => {
          const items = clothes.filter((item) => item.category === category);
          return (
            <View key={category} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{category}:</Text>
              {items.length > 0 ? (
                <FlatList
                  horizontal
                  data={items}
                  renderItem={renderClothingItem}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noItemsContainer}>
                  <Text style={styles.noItemsText}>No items added yet</Text>
                </View>
              )}
            </View>
          );
        })}
      </Animated.ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={pickImage}>
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  categoryCard: {
    backgroundColor: '#1E1E1E',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
  },
  categoryTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noItemsContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsText: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  itemContainer: {
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    marginHorizontal: 8,
    elevation: 3,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#4A90E2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Closet;
