import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { ip } from './global';

const Library = ({navigation}) => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBook, setFilteredBook] = useState([]);

    useEffect(() => {
        handleBook();
    }, []);

    const handleBook = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            console.log('JWT Token:', token); // Check the token value here

            if (!token) {
                throw new Error('JWT Token not found');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            // Sending GET request for books
            const response = await axios.get('http://192.168.0.106:8000/api/book/get', config);
            // Sending GET request for book requests
            const result = await axios.get('http://192.168.0.106:8000/api/book/my-requests', config);

            // Extracting request list or assigning an empty array
            const requests = result?.data?.data?.request_list ?? [];

            if (response.data && response.data.data && Array.isArray(response.data.data.book)) {
                const books = response.data.data.book.map(book => {
                    // Find the request matching the current book's id
                    const matchingRequest = requests.find(req => req.book_id === book.id);

                    // If a matching request is found, add the status to the book object
                    return matchingRequest ? { ...book, status: matchingRequest.status } : book;
                });

                console.log(books);
                setBooks(books); // Ensure this is an array
                setFilteredBook(books); // Update the filtered books if necessary
            } else {
                throw new Error('No books found in response or data is not an array');
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message);
        }
    };

    const filterBook = () => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredBook = books.filter(item => {
            return Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredBook(filteredBook);
    };

    useEffect(() => {
        filterBook();
    }, [searchQuery, books]);

    const renderItem = ({ item }) => (
        <View style={styles.studentItem}>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Book Id: </Text>{item.id}</Text>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Book Name: </Text>{item.book_name}</Text>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Author Name: </Text>{item.author_name}</Text>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Published Year: </Text>{item.published_year}</Text>
            <View style={styles.btncon}>
                <TouchableOpacity style={styles.updateButton}
                    onPress={() => navigation.navigate('Issue')} >
                    <Text style={styles.deleteButtonText}>Issue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateButton}
                onPress={() => navigation.navigate('')} >
                 <Text style={styles.deleteButtonText}>{item.status}</Text>
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
                style={{ backgroundColor: '#cdcddb' }}
            />
            {error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={filteredBook}
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
    studentItem: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#3b3b66',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    style: {
        fontSize: 14,
        color: 'white',
        marginBottom: 4,
        fontWeight: '300',
    },
    btncon: {
        flex: 1,
        flexDirection: 'row',
      },
      updateButton: {
        backgroundColor: '#8c8c9f',
        width: '20%',
        borderRadius: 5,
        marginEnd: 5,
        padding: 5,
      },
      deleteButton: {
        backgroundColor: '#8c8c9f',
        width: '20%',
        borderRadius: 5,
        padding: 5,
      },
      deleteButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight:'600',
      },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default Library;
