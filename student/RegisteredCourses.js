import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const RegisteredCourses = () => {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        handleCourse();
    }, []);

    const handleCourse = async () => {
        try {
            const response = await axios.get('http://192.168.0.106:8000/api/course-registeration/courses/2/approved');
           if (response.data ) {
                console.log(response.data);
                setCourse(response.data);
            }
        } catch (error) {
            console.error('Error fetching Course:', error);
            setError(error.message);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.studentItem}>
            <Text style={styles.style}><Text style={{fontWeight:'700', color:'#cdcddb'}}>Course code: </Text>{item.code}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'700', color:'#cdcddb'}}>Course Name: </Text>{item.name}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'700', color:'#cdcddb'}} >Department: </Text>{item.department}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'700', color:'#cdcddb'}}>Semester: </Text>{item.semester}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'700', color:'#cdcddb'}}>Credit_hour: </Text>{item.credit_hour}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {error ? (
                <Text style={styles.error}>Error: {error}</Text>
            ) : (
                <FlatList
                    data={course}
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
        fontSize: 16,
        color:'#cdcddb',
        marginBottom: 4,
        fontWeight:'400',
    },
    email: {
        fontSize: 16,
        marginBottom: 4,
    },
    department: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
      //  marginTop: 20,
    },
});

export default RegisteredCourses;
