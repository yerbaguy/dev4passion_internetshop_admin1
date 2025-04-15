import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CategoriesScreen = ({ navigation }) => {
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

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={styles.category}
            onPress={() => navigation.navigate('CategoryDetails', { categoryId: item.id, categoryName: item.name })}
        >
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryBudget}>Budget: ${item.budget?.toFixed(2) || '0.00'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Categories</Text>
            <FlatList
                data={categories}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                ListEmptyComponent={<Text style={styles.emptyText}>No categories found</Text>}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCategory')}
            >
                <Text style={styles.addButtonText}>Add New Category</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    category: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    categoryName: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500',
    },
    categoryBudget: {
        fontSize: 16,
        color: '#666',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CategoriesScreen;