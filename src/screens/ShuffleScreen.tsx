import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { commonStyles } from '@styles/commonStyles';

interface ClothingItem {
    uri: string;
    category: string;
}

const categoryOrder = ['Hat', 'Jacket', 'Shirt', 'Pants', 'Shoes', 'Accessories'];

interface ShuffleScreenProps {
    route: {
        params: {
            clothes: ClothingItem[];
        };
    };
}

const getRandomItem = (items: ClothingItem[]) => {
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
};

const ShuffleScreen: React.FC<ShuffleScreenProps> = ({ route }) => {
    const { clothes } = route.params;

    if (!clothes) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No Clothes Available</Text>
            </View>
        );
    }

    const groupedClothes = categoryOrder.map(category => ({
        category,
        items: clothes.filter(item => item.category === category),
    }));

    const renderItem = ({ item }: { item: ClothingItem }) => (
        <View style={styles.clothingItem}>
            <Image source={{ uri: item.uri }} style={styles.clothingImage} />
            <Text style={styles.clothingText}>{item.category}</Text>
        </View>
    );

    const randomClothes = groupedClothes.map(group => getRandomItem(group.items)).filter(Boolean) as ClothingItem[];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Random Outfit</Text>
            <FlatList
                data={randomClothes}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.category}-${index}`}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

export default ShuffleScreen;

const styles = StyleSheet.create({
    ...commonStyles,
    flatListContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    clothingItem: {
        marginBottom: 20,
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
        fontSize: 16,
        fontWeight: 'bold',
    },
});
