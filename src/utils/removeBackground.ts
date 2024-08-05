import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

const REMOVE_BG_API_KEY = '4MPLWRbb7Fx6XimP8JF3sfd7';  // Replace with your actual API key

export const removeBackground = async (imageUri: string) => {
    const formData = new FormData();
    formData.append('image_file', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
    });

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-Api-Key': REMOVE_BG_API_KEY,
            },
            responseType: 'arraybuffer',
        });

        if (response.status !== 200) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const base64Image = `data:image/png;base64,${Buffer.from(response.data).toString('base64')}`;
        const fileUri = `${FileSystem.documentDirectory}${Date.now()}.png`;
        await FileSystem.writeAsStringAsync(fileUri, base64Image.replace('data:image/png;base64,', ''), {
            encoding: FileSystem.EncodingType.Base64,
        });

        return { result_b64: fileUri };
    } catch (error) {
        console.error('Error removing background:', error);
        throw error;
    }
};

