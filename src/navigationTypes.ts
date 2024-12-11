// src/navigationTypes.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';

export interface ClothingItem {
    id: string;
    uri: string;
    category: string;
    name: string;
    color: string;
    brand: string;
    price: string;
}

// Define your root stack parameters including all screens and their params
export type RootStackParamList = {
    InsideLayout: undefined;
    Login: undefined;
    CreateAccount: undefined;
    // If Closet is also a top-level stack screen (you navigate to it directly), leave it here
    // with optional parameters. Otherwise, if it's strictly a tab screen inside InsideLayout,
// remove Closet from the stack param list.
    Closet: { chosenCategory?: string; selectedImageUri?: string } | undefined; 

    // Add CategorySelectScreen with its required param
    CategorySelectScreen: { selectedImageUri: string };

    // If Shuffle is strictly a tab screen, you don't need params here. 
    // If you navigate to Shuffle with params directly from the stack, keep it:
    Shuffle: { clothes: ClothingItem[] };
};

// Tab param list for the bottom tabs
export type RootTabParamList = {
    Closet: undefined;
    Shuffle: undefined;
    Favorites: undefined;
};

// Individual navigation/route prop types
export type LoginScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Login'
>;

export type CreateAccountScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CreateAccount'
>;

export type ShuffleScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Shuffle'
>;

export type ShuffleScreenRouteProp = RouteProp<
    RootStackParamList,
    'Shuffle'
>;

export type InsideLayoutScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'InsideLayout'
>;

// Use BottomTabNavigationProp for tab screens
export type ClosetTabNavigationProp = BottomTabNavigationProp<
    RootTabParamList,
    'Closet'
>;

// Add optional convenience types for CategorySelectScreen if needed
export type CategorySelectScreenRouteProp = RouteProp<
    RootStackParamList,
    'CategorySelectScreen'
>;

export type CategorySelectScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'CategorySelectScreen'
>;
