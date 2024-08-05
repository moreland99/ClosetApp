// src/screens/ShuffleScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, ShuffleScreenRouteProp, ClothingItem } from '../navigationTypes';
import { commonStyles } from '@styles/commonStyles';
import { MaterialIcons } from '@expo/vector-icons';

const ShuffleScreen = () => {
    const route = useRoute<ShuffleScreenRouteProp>();
    const { clothes } = route.params;

    const [shuffledClothes, setShuffledClothes] = useState<ClothingItem[]>([]);

    useEffect(() => {
        shuffleClothes();
    }, []);

    const shuffleClothes = () => {
        const categories = [...new Set(clothes.map(item => item.category))];
        const shuffled = categories.map(category => {
            const items = clothes.filter(item => item.category === category);
            return items[Math.floor(Math.random() * items.length)];
        });
        setShuffledClothes(shuffled);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Shuffle Outfit</Text>
            {shuffledClothes.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Text style={styles.itemCategory}>{item.category}</Text>
                    <Image source={{ uri: item.uri }} style={styles.itemImage} />
                </View>
            ))}
            <TouchableOpacity style={styles.shuffleButton} onPress={shuffleClothes}>
                <MaterialIcons name="shuffle" size={24} color="white" />
                <Text style={styles.shuffleButtonText}>Shuffle Again</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ShuffleScreen;

const styles = StyleSheet.create({
    ...commonStyles,
    itemContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    itemCategory: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 5,
    },
    itemImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    shuffleButton: {
        backgroundColor: 'tomato',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
    },
    shuffleButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
});
