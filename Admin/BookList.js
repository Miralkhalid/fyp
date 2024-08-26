import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('http://192.168.0.106:8000/api/book/get', config);

            if (response.data?.data?.book) {
                setBooks(response.data.data.book);
                setFilteredBooks(response.data.data.book);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message);
        }
    };

    const handleDelete = async (bookId) => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.delete(`http://192.168.0.106:8000/api/book/delete/${bookId}`, config);

                if (response.status === 200) {
                    Alert.alert('Book deleted successfully');
                    fetchBooks(); // Refresh the list after deletion
                }
            } catch (error) {
                console.error('Error deleting book:', error.response?.data || error.message);
                setError(error.response?.data?.message || error.message);
            }
        };

    const filterBooks = () => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredBooks = books.filter(item =>
            Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(lowercasedFilter)
            )
        );
        setFilteredBooks(filteredBooks);
    };

    useEffect(() => {
        filterBooks();
    }, [searchQuery, books]);

    const renderItem = ({ item }) => (
        <View style={styles.bookItem}>
            <Text style={styles.text}>
                <Text style={styles.label}>Book Name: </Text>{item.book_name}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Author Name: </Text>{item.author_name}
            </Text>
            <Text style={styles.text}>
                <Text style={styles.label}>Published Year: </Text>{item.published_year}
            </Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />
            {error ? (
                <Text style={styles.errorText}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={filteredBooks}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    bookItem: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#3b3b66',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    text: {
        fontSize: 14,
        color: 'white',
        marginBottom: 4,
        fontWeight: '300',
    },
    label: {
        fontWeight: '500',
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    deleteButton: {
        backgroundColor: '#8c8c9f',
        borderRadius: 5,
        padding: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: '600',
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    searchBar: {
        backgroundColor: '#cdcddb',
    },
});

export default BookList;
