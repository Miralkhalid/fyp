import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookApproval = () => {
    const [book_data, setBookData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleRequest();
    }, []);

    const handleRequest = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const response = await axios.get('http://192.168.0.106:8000/api/book/requests', config);

            // Check if the response contains data and book_request array
            if (response.data && response.data.data && response.data.data.book_request) {
                setBookData(response.data.data.book_request);
            } else {
                setError('No data available');
            }
        } catch (error) {
            console.error('Error fetching requests:', error.response?.data || error.message);
            setError('Failed to fetch data');
        }
    };

    const handlePress = async (book_id, student_id) => {
        const token = await AsyncStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        const body = {
            student_id: student_id
        };

        const url = `http://192.168.0.106:8000/api/book/request/${book_id}/update`;

        try {
            console.log(`Sending request to: ${url}`); // Log the URL to check correctness
            const response = await axios.post(url, body, config);
            if (response.data && response.data.status === 'success') {
                Alert.alert('Approval Success', 'Book request has been successfully approved.');
                handleRequest(); // Refetch the data
            } else {
                setError('Failed to approve request');
            }
        } catch (error) {
            console.error('Error approving request:', error.response?.data || error.message);
            setError('Failed to approve request');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.style}><Text style={styles.label}>Book Name: </Text>{item.book.book_name || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Author Name: </Text>{item.book.author_name || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Published Year: </Text>{item.book.published_year || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Student Name: </Text>{item.user.name || 'N/A'}</Text>
            <View style={styles.btncon}>
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => handlePress(item.book_id, item.user_id)} // Pass book_id and user_id here
                >
                    <Text style={styles.deleteButtonText}>Approve</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={book_data}
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
    item: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#3b3b66',
        borderRadius: 5,
        color: 'white',
        borderWidth: 1,
        borderColor: 'black',
    },
    style: {
        fontSize: 15,
        color: 'white',
    },
    label: {
        fontWeight: '400',
        color: 'white',
    },
    deleteButtonText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    updateButton: {
        backgroundColor: '#8c8c9f',
        width: '25%',
        borderRadius: 5,
        marginEnd: 5,
        padding: 10,
    },
    btncon: {
        flex: 1,
        flexDirection: 'row',
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default BookApproval;
