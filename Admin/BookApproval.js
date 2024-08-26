import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookApproval = () => {
    const [bookData, setBookData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleRequest();
    }, []);

    const handleRequest = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('http://192.168.0.106:8000/api/book/requests', config);

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

   const handlePress = async (bookId, studentId) => {
       const token = await AsyncStorage.getItem('jwtToken');
       const config = {
           headers: {
               Authorization: `Bearer ${token}`,
               'Content-Type': 'multipart/form-data',
           },
       };

       const formData = new FormData();
       formData.append('status', 'approved');

       const url = `http://192.168.0.106:8000/api/book/request/${bookId}/update`;

       try {
           const response = await axios.post(url, formData, config);

           if (response.data && response.data.status === 'success') {
               Alert.alert('Approval Success', 'Book request has been successfully approved.');
               handleRequest(); // Refetch the data
           }
       } catch (error) {
           const errorMessage = error.response?.data?.message || 'Failed to approve request';
           console.error('Error approving request:', error.response?.data);

           // Handle specific error scenario for overlapping bookings
           if (errorMessage.includes('Book is already issued to another student')) {
               Alert.alert('Approval Failed', 'The book is already issued to another student during the requested date range.');
           } else {
               Alert.alert('Error', errorMessage);
           }
       }
   };


    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.style}><Text style={styles.label}>Book Name: </Text>{item.book?.book_name || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>From Date: </Text>{item.from_date || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>To Date: </Text>{item.to_date || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Student Name: </Text>{item.user?.name || 'N/A'}</Text>
            <View style={styles.btncon}>
                <TouchableOpacity
                    style={[styles.updateButton, item.status === 'approved' && styles.disabledButton]}
                    disabled={item.status === 'approved'}
                    onPress={() => handlePress(item.book_id, item.user_id)}
                >
                    <Text style={styles.deleteButtonText}>{item.status === 'pending' ? 'Approve Book' : 'Already Issued'}</Text>
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
                    data={bookData}
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
        width: '100%',
        fontSize: 11,
    },
    updateButton: {
        backgroundColor: '#8c8c9f',
        width: '30%',
        borderRadius: 5,
        marginEnd: 5,
        padding: 10,
    },
    disabledButton: {
        backgroundColor: 'black',
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
