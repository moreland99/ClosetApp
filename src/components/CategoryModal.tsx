import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const categories = ['Shirt', 'Jacket', 'Pants', 'Shorts', 'Shoes', 'Uncategorized'];

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onCategorySelect: (category: string) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onCategorySelect }) => {
    const [selectedCategory, setSelectedCategory] = useState('Uncategorized');

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select Category</Text>
                    <Picker
                        selectedValue={selectedCategory}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                        style={styles.picker}
                    >
                        {categories.map((category) => (
                            <Picker.Item key={category} label={category} value={category} />
                        ))}
                    </Picker>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            onCategorySelect(selectedCategory);
                            onClose();
                        }}
                    >
                        <Text style={styles.modalButtonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CategoryModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 20,
        color: '#ffffff',
    },
    picker: {
        width: '100%',
        color: '#ffffff',
    },
    modalButton: {
        marginTop: 20,
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#ffffff',
    },
});
