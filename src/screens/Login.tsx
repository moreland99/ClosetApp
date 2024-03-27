import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FIREBASE_AUTH } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error);
            Alert.alert('Sign in failed: ' + error.message);
        } finally {
        setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert('Check your emails!');
        } catch (error: any) {
            console.log(error);
            Alert.alert('Sign in failed: ' + error.message);
        } finally {
        setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder='Email' value={email} onChangeText={setEmail} autoCapitalize='none' />
            <TextInput secureTextEntry={true} style={styles.input} placeholder='Password' value={password} onChangeText={setPassword} />
    
            { loading? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Button title='Login' onPress={signIn} />
                    <Button title='Create Account' onPress={signUp} />
                </>
            )}
        </View>
    )
            }
export default Login

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      margin: 10,
      color: '#333333',
    },
    input: {
      height: 50,
      width: '80%',
      marginTop: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
    buttonContainer: {
      marginTop: 20,
      width: '80%',
      backgroundColor: '#007BFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    footer: {
      marginTop: 20,
    },
    footerText: {
      fontSize: 14,
      color: '#555',
    },
  });
