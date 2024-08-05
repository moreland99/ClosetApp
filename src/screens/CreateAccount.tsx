import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { CreateAccountScreenNavigationProp } from '../navigationTypes';
import { commonStyles } from '../styles/commonStyles';

const CreateAccount = () => {
    const navigation = useNavigation<CreateAccountScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const signUp = async () => {
        if (!isValidEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }
        if (!isValidPassword(password)) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters long.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert('Account created successfully!');
            navigation.navigate('Login'); // Navigate back to Login screen
        } catch (error: any) {
            console.log(error);
            Alert.alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
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
            <TextInput
                secureTextEntry={true}
                style={styles.input}
                placeholder='Confirm Password'
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#a9a9a9"
            />
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkButtonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateAccount;

const styles = StyleSheet.create({
    ...commonStyles,
});
