import React, { useState } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, ShuffleScreenRouteProp } from '../navigationTypes';
import { commonStyles } from '../styles/commonStyles';

const ShuffleScreen = () => {
    const route = useRoute<ShuffleScreenRouteProp>();
    const { clothes } = route.params;

    const [shuffledClothes, setShuffledClothes] = useState(() => shuffleClothes(clothes));

    function shuffleClothes(clothes: typeof route.params.clothes) {
        const categories = ['Hat', 'Accessories', 'Jacket', 'Shirt', 'Pants', 'Shoes'];
        return categories.reduce((acc, category) => {
            const items = clothes.filter(item => item.category === category);
            if (items.length > 0) {
                const randomItem = items[Math.floor(Math.random() * items.length)];
                acc[category] = randomItem;
            }
            return acc;
        }, {} as { [key: string]: typeof clothes[0] });
    }

    const shuffleAgain = () => {
        setShuffledClothes(shuffleClothes(clothes));
    };

    const renderItem = (item: typeof clothes[0]) => (
        <View key={item.category} style={styles.itemContainer}>
            <Image source={{ uri: item.uri }} style={styles.itemImage} />
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.rowContainer}>
                {shuffledClothes.Hat && renderItem(shuffledClothes.Hat)}
                {shuffledClothes.Accessories && renderItem(shuffledClothes.Accessories)}
            </View>
            <View style={styles.rowContainer}>
                {shuffledClothes.Jacket && renderItem(shuffledClothes.Jacket)}
                {shuffledClothes.Shirt && renderItem(shuffledClothes.Shirt)}
            </View>
            {shuffledClothes.Pants && renderItem(shuffledClothes.Pants)}
            {shuffledClothes.Shoes && renderItem(shuffledClothes.Shoes)}
            <TouchableOpacity style={styles.shuffleButton} onPress={shuffleAgain}>
                <Text style={styles.shuffleButtonText}>Shuffle Again</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ShuffleScreen;

const styles = StyleSheet.create({
    ...commonStyles,
    container: {
        padding: 20,
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    itemContainer: {
        marginHorizontal: 10,
    },
    itemImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    shuffleButton: {
        backgroundColor: 'tomato',
        padding: 15,
        borderRadius: 10,
        marginTop: 170,
    },
    shuffleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
