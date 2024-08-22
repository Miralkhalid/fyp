import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.0.106:8000/api';
const BookList = () => {
    const [book, setBook] = useState([]);
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
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            // Sending GET request without parameters
//            const response = await axios.get('http://192.168.0.106:8000/api/book/get', config);
             const response = await axios.get(`${API_URL}/api/book/get`, config);

            if (response.data && response.data.data && response.data.data.book) {
                console.log(response.data.data.book);
                setBook(response.data.data.book);
                setFilteredBook(response.data.data.book); // Corrected to match your backend response
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        try {
          const token = await AsyncStorage.getItem('jwtToken');
//          const response = await axios.delete(`http://192.168.0.106:8000/api/book/delete`, {
           const response = await axios.delete(`${API_URL}/api/book/delete`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            handleStaff();
            Alert.alert('Book deleted successfully');
          }
        } catch (error) {
          console.error('Error deleting book:', error);
          setError(error.message);
        }
      };

    const filterBook = () => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredBook = book.filter(item => {
            return Object.keys(item).some(key =>
                String(item[key]).toLowerCase().includes(lowercasedFilter)
            );
        });
        setFilteredBook(filteredBook);
    };

    useEffect(() => {
        filterBook();
    }, [searchQuery, book]);

    const renderItem = ({ item }) => (
        <View style={styles.studentItem}>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Book Name: </Text>{item.book_name}</Text>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Author Name: </Text>{item.author_name}</Text>
            <Text style={styles.style}><Text style={{fontWeight: '500', color: 'white'}}>Published Year: </Text>{item.published_year}</Text>
            <View style={styles.btncon}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
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

export default BookList;
