import React, { useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { firestore, storage } from '../firebase/config';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);

    // Request permission for gallery access
    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission',
                    message: 'App needs access to your gallery to select an image.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // iOS permissions are handled via Info.plist
    };

    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Storage access is required.');
            return;
        }

        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
        });

        if (!result.didCancel && result.assets) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = async () => {
        if (!image) return null;
        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const ref = storage().ref().child(`products/${Date.now()}`);
            await ref.put(blob);
            return await ref.getDownloadURL();
        } catch (error) {
            console.error('Image upload failed:', error);
            throw error;
        }
    };

    const addProduct = async () => {
        if (!name || !price) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        try {
            const imageUrl = await uploadImage();
            await firestore().collection('products').add({
                name,
                price: parseFloat(price),
                image: imageUrl || '',
            });
            Alert.alert('Success', 'Product added successfully');
            setName('');
            setPrice('');
            setImage(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to add product');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Product Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />
            <Button title="Pick Image" onPress={pickImage} />
            <Button title="Add Product" onPress={addProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});

export default AddProductScreen;