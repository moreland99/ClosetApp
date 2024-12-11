// src/components/CategoryModal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => Promise<void>;
  loading: boolean;
}

const categories = ['Hats', 'Jackets', 'Shirts', 'Pants', 'Shoes', 'Accessories'];

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onCategorySelect, loading }) => {
  console.log('CategoryModal visible:', visible, 'loading:', loading);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      // Remove extra modal props for now
    >
      <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[{ width: '80%', backgroundColor: '#fff', padding: 20, borderRadius: 10 }]}>
          <Text style={[{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }]}>Select Category</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[{ backgroundColor: '#4A90E2', padding: 10, borderRadius: 5, marginBottom: 10, alignItems: 'center' }]}
              onPress={async () => {
                console.log('Category selected:', category);
                await onCategorySelect(category);
              }}
            >
              <Text style={{ color: '#fff' }}>{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[{ backgroundColor: 'red', padding: 10, borderRadius: 5, marginTop: 10, alignItems: 'center' }]}
            onPress={onClose}
          >
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={[{ position: 'absolute', top:0, left:0, right:0, bottom:0, justifyContent: 'center', alignItems: 'center', backgroundColor:'rgba(0,0,0,0.5)' }]}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CategoryModal;
