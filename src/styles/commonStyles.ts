// Create a common styles file for consistency
// src/styles/commonStyles.ts
import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#ffffff',
    },
    input: {
        height: 50,
        width: '100%',
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#333333',
        borderRadius: 5,
        color: '#ffffff',
    },
    button: {
        marginTop: 20,
        width: '100%',
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 20,
    },
    linkButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
});
