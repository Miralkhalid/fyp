import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from './global';

const RegisteredCourses = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchApprovedCourses();
    }, []);

    const fetchApprovedCourses = async () => {
        try {
            const student_id = await AsyncStorage.getItem('studentId');
            console.log(student_id);
            const token = await AsyncStorage.getItem('jwtToken');
             const url = `${ip}/api/course-registeration/courses/${student_id}/approved`;

            console.log('Fetching URL:', url); // Debug URL

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                setCourses(response.data);
            console.log('Response Data:', response.data); // Debug response data

            } else {
                setError('No data available');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.courseItem}>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Course Code: </Text>{item.course?.code || 'N/A'}</Text>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Course Name: </Text>{item.course?.name || 'N/A'}</Text>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Department: </Text>{item.course?.department || 'N/A'}</Text>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Semester: </Text>{item.course?.semester || 'N/A'}</Text>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Credit Hour: </Text>{item.course?.credit_hour || 'N/A'}</Text>
            <Text style={styles.text}><Text style={{fontWeight:'500', color:'white'}}>Approval Status: </Text>{item.is_approved ? 'Approved' : 'Pending'}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={courses}
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
    courseItem: {
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
    },
    label: {
        fontWeight: '700',
        color: '#cdcddb',
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default RegisteredCourses;
