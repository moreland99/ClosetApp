// src/screens/CategorySelectScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CategorySelectScreenNavigationProp, CategorySelectScreenRouteProp } from '../navigationTypes'; // Adjust the import path

const categories = ['Hats', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

export default function CategorySelectScreen() {
  const navigation = useNavigation<CategorySelectScreenNavigationProp>();
  const route = useRoute<CategorySelectScreenRouteProp>();
  const { selectedImageUri } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryButton}
          onPress={() => {
            // Navigate back to Closet with chosenCategory and selectedImageUri
            navigation.navigate('Closet', { chosenCategory: category, selectedImageUri });
          }}
        >
          <Text style={styles.categoryText}>{category}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.categoryButton, { backgroundColor: 'red' }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.categoryText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  title: { fontSize: 24, color: 'white', marginBottom: 20 },
  categoryButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  categoryText: { color: '#fff', fontSize: 16 },
});
