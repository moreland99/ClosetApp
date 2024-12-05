import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCategorySelect: (category: string) => void;
  loading: boolean;
}

const categories = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onCategorySelect, loading }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
        <View style={tw`w-4/5 bg-white p-5 rounded-lg items-center`}>
          <Text style={tw`text-lg font-bold mb-4`}>Select Category</Text>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={tw`w-full bg-blue-500 p-3 rounded-md mb-3 items-center`}
              onPress={async () => {
                await onCategorySelect(category);
                onClose();
              }}
            >
              <Text style={tw`text-white text-base`}>{category}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={tw`w-full bg-red-500 p-3 rounded-md mt-3 items-center`}
            onPress={onClose}
          >
            <Text style={tw`text-white text-base`}>Close</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={tw`absolute inset-0 justify-center items-center`}>
            <ActivityIndicator size="large" color="#007BFF" />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CategoryModal;
  