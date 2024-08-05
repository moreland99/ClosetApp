import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryModal from '../components/CategoryModal';
import { removeBackground } from '../utils/removeBackground';
import { shuffleOutfits } from '../utils/shuffleOutfits';
import { commonStyles } from '../styles/commonStyles';

interface ClothingItem {
    uri: string;
    category: string;
}

const Closet = () => {
    const [clothes, setClothes] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImageUri(result.uri);
            setModalVisible(true);
        }
    };

    const onCategorySelect = async (category: string) => {
        setLoading(true);
        try {
            const bgRemoved = await removeBackground(selectedImageUri!);
            setClothes([...clothes, { uri: bgRemoved.result_b64, category }]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: ClothingItem }) => (
        <View style={styles.clothingItem}>
            <Image source={{ uri: item.uri }} style={styles.clothingImage} />
            <Text style={styles.clothingText}>{item.category}</Text>
        </View>
    );

    const shuffle = () => {
        const outfits = shuffleOutfits(clothes);
        console.log(outfits);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Closet</Text>
            <FlatList
                data={clothes}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                style={styles.flatList}
                contentContainerStyle={styles.flatListContent}
            />
            <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.shuffleButton} onPress={shuffle}>
                <Text style={styles.shuffleButtonText}>Shuffle Outfits</Text>
            </TouchableOpacity>
            <CategoryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCategorySelect={onCategorySelect}
            />
            {loading && (
                <Modal transparent={true}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#007BFF" />
                    </View>
                </Modal>
            )}
        </View>
    );
};

export default Closet;

const styles = StyleSheet.create({
    ...commonStyles,
    flatList: {
        flex: 1,
        width: '100%',
    },
    flatListContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    clothingItem: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
    },
    clothingImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    clothingText: {
        marginTop: 10,
        color: '#ffffff',
    },
    addButton: {
        backgroundColor: '#007BFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    shuffleButton: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    shuffleButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});