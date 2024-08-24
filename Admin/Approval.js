import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
//const API_URL = 'http://192.168.0.106:8000/api';
const Approval = () => {
    const [courseData, setCourseData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleCourse();
    }, []);

    const handleCourse = async () => {
        const token = await AsyncStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            const response = await axios.get('http://192.168.0.106:8000/api/course-registeration/pending-approvals', config);
//             const response = await axios.get(`http://192.168.166.191:8000/api/course-registeration/pending-approvals`, config);
            if (response.data && response.data.data) {
                setCourseData(response.data.data);
            } else {
                setError('No data available');
            }
        } catch (error) {
            console.error('Error fetching course:', error);
            setError('Failed to fetch data');
        }
    };

    const handlePress = async (course_id, student_id) => {
        const token = await AsyncStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const body = {
            student_id: student_id
        };
        console.log(course_id,'course_id, student_id', student_id);
//        const url = `http://192.168.166.191:8000/api/course-registeration/${course_id}/approve`;
         const url = `http://192.168.0.106:8000/api/course-registeration/${course_id}/approve`;

        try {
            console.log(`Sending request to: ${url}`); // Log the URL to check correctness
            const response = await axios.post(url, body, config);
            console.log(response);
            console.log(response.data);
            if (response.data && response.data.status === 'success') {
                console.log(response.data.status);
                Alert.alert('Approval Success', 'Course has been successfully approved.');
                handleCourse(); // Refetch the data
            } else {
                setError('No data available');
            }
        } catch (error) {
            console.error('Error approving course:', error.response?.data || error.message);
            setError('Failed to approve course');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.style}><Text style={styles.label}>Course Code: </Text>{item.course?.code || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Course Name: </Text>{item.course?.name || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Department: </Text>{item.course?.department || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Semester: </Text>{item.course?.semester || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Credit Hour: </Text>{item.course?.credit_hour || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Created By: </Text>{item.course?.created_by || 'N/A'}</Text>
            <Text style={styles.style}><Text style={styles.label}>Student Name: </Text>{item.student?.name || 'N/A'}</Text>
            <View style={styles.btncon}>
                <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => handlePress(item.course_id, item.student_id)} // Pass course_id and student_id here
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
                    data={courseData}
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

export default Approval;
