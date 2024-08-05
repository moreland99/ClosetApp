import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login';
import Closet from './src/screens/Closet';
import CreateAccount from './src/screens/CreateAccount';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from './src/firebase/firebaseConfig';
import { Appearance, useColorScheme } from 'react-native';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="InsideCloset" component={Closet} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const scheme = useColorScheme();

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="LoginScreen">
        {user ? (
          <Stack.Screen name="InsideCloset" component={InsideLayout} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="CreateAccountScreen" component={CreateAccount} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
