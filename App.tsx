// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Login from './src/screens/Login';
import Closet from './src/screens/Closet';
import ShuffleScreen from './src/screens/ShuffleScreen';
import CreateAccount from './src/screens/CreateAccount';
import FavoritesScreen from './src/screens/FavoritesScreen';
import { ClothesProvider } from './src/contexts/ClothesContext';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/firebaseConfig';
import { Appearance, useColorScheme } from 'react-native';
import { RootStackParamList } from './src/navigationTypes';
import { TailwindProvider } from 'tailwindcss-react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function InsideLayout() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Closet') {
            iconName = 'checkroom';
          } else if (route.name === 'Shuffle') {
            iconName = 'shuffle';
          } else if (route.name === 'Favorites') {
            iconName = 'favorite';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Closet" component={Closet} />
      <Tab.Screen name="Shuffle" component={ShuffleScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
    </Tab.Navigator>
  );
}

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
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <>
              <Stack.Screen name="InsideLayout" component={InsideLayout} />
            </>
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
