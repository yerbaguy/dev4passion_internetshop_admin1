import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const subscriber = firestore()
            .collection('products')
            .onSnapshot(querySnapshot => {
                const productList = [];
                querySnapshot.forEach(doc => {
                    productList.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productList);
            });
        return () => subscriber();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product List</Text>
            <FlatList
                data={products}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.name} - ${item.price}</Text>
                        <Text>Category: {item.category}/{item.subcategory}</Text>
                    </View>
                )}
            />
            <Button title="Add Product" onPress={() => navigation.navigate('AddProduct')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    item: { padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
});

export default ProductListScreen;