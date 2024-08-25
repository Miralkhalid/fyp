import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

const courseId = 3;
const date = '2024-08-23';

const fetchAttendance = async () => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (!token) {
        setError('JWT Token not found');
        return;
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const url = `http://192.168.0.106:8000/api/student/showStudentAttendance?course_id=${courseId}&date=${date}`;
    console.log('Fetching attendance from:', url);
    console.log('With headers:', config);

    try {
        const response = await axios.get(url, config);
        console.log('API Response:', response);

        if (response.data && response.data.data) {
            setAttendance(response.data.data);  // Ensure that `response.data.data` contains the correct data structure
        } else {
            setError('Failed to fetch attendance data');
        }
    } catch (error) {
        console.error('Error fetching attendance:', error.response ? error.response.data : error.message);
        console.error('Error Error Error:', error);
        setError('Failed to fetch attendance data');
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
        fetchAttendance();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.attendanceItem}>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Student ID:</Text> {item.student_id}</Text>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Student Name:</Text> {item.student_name}</Text>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Attendance Status:</Text> {item.attendance_status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={attendance}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.student_id.toString()}
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
    attendanceItem: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    text: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default Attendance;
