// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { ClothesProvider } from './src/contexts/ClothesContext';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/firebaseConfig';

// Screens
import Login from './src/screens/Login';
import Closet from './src/screens/Closet';
import ShuffleScreen from './src/screens/ShuffleScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import CreateAccount from './src/screens/CreateAccount';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator (InsideLayout)
function InsideLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === 'Closet') {
            return (
              <MaterialCommunityIcons
                name={focused ? 'wardrobe' : 'wardrobe-outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Shuffle') {
            return (
              <Ionicons
                name={focused ? 'shuffle' : 'shuffle-outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Favorites') {
            return (
              <Ionicons
                name={focused ? 'heart' : 'heart-outline'}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#A9A9A9',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Closet" component={Closet} />
      <Tab.Screen name="Shuffle" component={ShuffleScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

// App Component
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const scheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authenticatedUser) => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <TailwindProvider>
      <ClothesProvider>
        <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <Stack.Screen name="InsideLayout" component={InsideLayout} />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="CreateAccount" component={CreateAccount} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ClothesProvider>
    </TailwindProvider>
  );
}
