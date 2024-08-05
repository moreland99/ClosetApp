// src/navigationTypes.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export interface ClothingItem {
    uri: string;
    category: string;
}

export type RootStackParamList = {
    InsideLayout: undefined;
    Login: undefined;
    CreateAccount: undefined;
    Closet: undefined;
    Shuffle: { clothes: ClothingItem[] };
};

export type RootTabParamList = {
    Closet: undefined;
    Shuffle: undefined;
};

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

export type ShuffleScreenRouteProp = RouteProp<RootStackParamList, 'Shuffle'>;

export type InsideLayoutScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'InsideLayout'
>;

export type ClosetTabNavigationProp = StackNavigationProp<
    RootTabParamList,
    'Closet'
>;
