import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = 'http://192.168.0.106:8000/api';
    const navigation = useNavigation(); // Initialize navigation

    useEffect(() => {
        fetchStudents();
    }, []);

   const fetchStudents = async () => {
       try {
           const token = await AsyncStorage.getItem('jwtToken');
           if (!token) {
               console.error('No token found. Please log in again.');
               return;
           }

           console.log('Token:', token);

           const response = await axios.get(`${API_BASE_URL}/admin/chat/students`, {
               headers: {
                   Authorization: `Bearer ${token}`,
               },
           });

           if (response.data.status === 'success' && response.data.data) {
               setStudents(response.data.data);
           } else {
               console.error('Failed to fetch students:', response.data.message);
           }
       } catch (error) {
           console.error('Failed to fetch students:', error);
       } finally {
           setLoading(false);
       }
   };

    const handlePress = (student) => {
        // Navigate to the chat screen and pass student details
        navigation.navigate('AdminChatbox', {
            studentId: student.id,
            studentName: student.name,
            studentEmail: student.email,
        });
    };

    const renderStudentItem = ({ item }) => (
        <View style={styles.studentItem}>
            <TouchableOpacity onPress={() => handlePress(item)}>
                <Text style={styles.studentName}>{item.name}</Text>
                <Text style={styles.studentEmail}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={students}
                renderItem={renderStudentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3b3b66',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    listContainer: {
        paddingBottom: 20,
    },
    studentItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'white',
    },
    studentName: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
    studentEmail: {
        fontSize: 14,
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default StudentList;
