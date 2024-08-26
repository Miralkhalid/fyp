import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Attendance = () => {
    const [courses, setCourses] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchApprovedCourses = async () => {
        setLoading(true);
        try {
            const student_id = await AsyncStorage.getItem('studentId');
            const token = await AsyncStorage.getItem('jwtToken');
            const url =`http://192.168.0.106:8000/api/course-registeration/courses/${student_id}/approved`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data) {
                setCourses(response.data);

                const attendancePromises = response.data.map(async (course) => {
                    await fetchAttendance(course.course_id);
                });

                await Promise.allSettled(attendancePromises); // Wait for all attendances to be fetched
            } else {
                setError('No data available');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

   const fetchAttendance = async (courseId) => {
     try {
       const token = await AsyncStorage.getItem('jwtToken');
       const date = new Date().toISOString().slice(0, 10);

       if (!token) {
         throw new Error('JWT Token not found')
       };

       const config = {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       };

       const url = `http://192.168.0.106:8000/api/student/showStudentAttendance?course_id=${courseId}&date=${date}`
       const response = await axios.get(url, config);

       if (response.data && response.data.data) {
       console.log(attendances);
         setAttendances((prevArr) => [...prevArr, response.data.data]);
       } else {
         console.log('Error While Fetching')
       }
     } catch (error) {
       console.log('Error => ', error.message)
     }
   };

    useEffect(() => {
        fetchApprovedCourses();
    }, []); // Empty dependency array to run the effect only once

    const renderItem = ({ item }) => (
        <View style={styles.attendanceItem}>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Student ID:</Text> {item?.student_id}</Text>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Course Name:</Text> {item?.course?.name}</Text>
            <Text style={styles.text}><Text style={{ fontWeight: '500' }}>Attendance Status:</Text> {item?.attendance}</Text>
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
                    data={attendances}
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