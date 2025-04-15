import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';

const AddProductScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [image, setImage] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('categories')
            .onSnapshot(querySnapshot => {
                const catList = [];
                querySnapshot.forEach(doc => {
                    catList.push({ id: doc.id, ...doc.data() });
                });
                setCategories(catList);
            });
        return () => subscriber();
    }, []);

    const pickImage = () => {
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = e => setImage(e.target.files[0]);
            input.click();
        } else {
            ImagePicker.launchImageLibrary({ mediaType: 'photo' }, response => {
                if (!response.didCancel) setImage(response.assets[0]);
            });
        }
    };

    const addProduct = async () => {
        let imageUrl = '';
        if (image) {
            const ref = storage().ref(`products/${name}-${Date.now()}`);
            await ref.putFile(image.uri || image);
            imageUrl = await ref.getDownloadURL();
        }

        await firestore().collection('products').add({
            name,
            price: parseFloat(price),
            category,
            subcategory,
            imageUrl,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Product Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
            <TextInput style={styles.input} placeholder="Subcategory" value={subcategory} onChangeText={setSubcategory} />
            <Button title="Pick Image" onPress={pickImage} />
            <Button title="Add Product" onPress={addProduct} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
});

export default AddProductScreen;