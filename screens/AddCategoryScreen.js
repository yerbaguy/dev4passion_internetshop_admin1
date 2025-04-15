import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddCategoryScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [budget, setBudget] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddCategory = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Category name is required');
            return;
        }

        setIsSubmitting(true);
        try {
            const categoryData = {
                name: name.trim(),
                budget: budget ? parseFloat(budget) : 0,
                createdAt: firestore.FieldValue.serverTimestamp(),
            };

            await firestore().collection('categories').add(categoryData);
            Alert.alert('Success', 'Category added successfully');
            setName('');
            setBudget('');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to add category. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add New Category</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Category Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter category name"
                    autoCapitalize="words"
                />
                <Text style={styles.label}>Budget (Optional)</Text>
                <TextInput
                    style={styles.input}
                    value={budget}
                    onChangeText={text => setBudget(text.replace(/[^0-9.]/g, ''))}
                    placeholder="Enter budget amount"
                    keyboardType="numeric"
                />
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                    onPress={handleAddCategory}
                    disabled={isSubmitting}
                >
                    <Text style={styles.submitButtonText}>
                        {isSubmitting ? 'Adding...' : 'Add Category'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
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
        marginBottom: 24,
        color: '#333',
    },
    form: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    disabledButton: {
        backgroundColor: '#99ccff',
    },
    cancelButton: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddCategoryScreen;