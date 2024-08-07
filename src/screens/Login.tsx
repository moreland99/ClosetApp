import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenNavigationProp } from '../navigationTypes';
import { commonStyles } from '../styles/commonStyles';

const Login = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const signIn = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (!isValidPassword(password)) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }
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
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder='Email'
                value={email}
                onChangeText={setEmail}
                autoCapitalize='none'
                keyboardType='email-address'
                placeholderTextColor="#a9a9a9"
            />
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder='Password'
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#a9a9a9"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <>
                    <TouchableOpacity style={styles.button} onPress={signIn}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('CreateAccount')}>
                        <Text style={styles.linkButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    ...commonStyles,
});

