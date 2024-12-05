import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
  loading: boolean;
}

const categories = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onCategorySelect, loading }) => {
  // Debugging for visibility prop
  console.log('CategoryModal visibility:', visible);

  return (
    console.log('CategoryModal visibility:', visible),
<Modal
  animationType="slide"
  transparent={true}
  visible={visible} // Ensure this prop is passed and true
  onRequestClose={onClose}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Select Category</Text>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={styles.categoryButton}
          onPress={async () => {
            await onCategorySelect(category); // Wait for category selection
            onClose(); // Close modal
          }}
        >
          <Text style={styles.categoryButtonText}>{category}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  );
};

export default CategoryModal;

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
      zIndex: 10, // Ensure modal overlay is above all other content
    },
    modalContainer: {
      width: '80%',
      padding: 20,
      backgroundColor: 'white', // Ensure visibility
      borderRadius: 10,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    categoryButton: {
      padding: 10,
      backgroundColor: '#007BFF',
      borderRadius: 5,
      marginBottom: 10,
      width: '100%',
      alignItems: 'center',
    },
    categoryButtonText: {
      color: 'white',
      fontSize: 16,
    },
    closeButton: {
      padding: 10,
      backgroundColor: '#FF0000',
      borderRadius: 5,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });  