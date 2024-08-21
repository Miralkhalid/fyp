import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

const Registration = () => {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourse, setFilteredCourse] = useState([]);
  
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://192.168.0.106:8000/api/course/list');
            if (response.data && response.data.data && response.data.data.data) {
                setCourse(response.data.data.data);
                setFilteredCourse(response.data.data);

            }
        } catch (error) {
            console.error('Error fetching course:', error);
            setError(error.message);
        }
    };

    const sendApprovalRequest = async (item) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await axios.post(`http://192.168.0.106:8000/api/course-registeration/${item.id}/register`, {
            // const response = await axios.post(`http://192.168.188.191:8000/api/course-registeration/${item.id}/register`, {
                course_id: item.id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                Alert.alert('Approval Request Sent', `Approval request for ${student_id} has been sent.`);
            } else {
                Alert.alert('Approval Failed', `Failed to send approval request for ${student_id}. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending approval request:', error);
            Alert.alert('Error', `Error sending approval request: ${error.message}`);
        }
    };

    const handleSelectCourse = async (item) => {
        const matchingCourses = selectedCourse.filter(course => course.code === item.code);
        console.log(matchingCourses);
        try {
            if (selectedCourse.find(course => course.id === item.id)) {
                Alert.alert('Already Selected', `You have already selected ${item.name}`);
            } else {
                setSelectedCourse([...selectedCourse, item]);
                Alert.alert('Selected Course', `You selected ${item.name}`);
                await sendApprovalRequest(item.id);
            }
        } catch (error) {
            console.error('Error handling course selection:', error);
            Alert.alert('Error', `Error handling course selection: ${error.message}`);
        }
    };
    const filterCourse = () => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredData = course.filter(item => {
          return Object.keys(item).some(key =>
            String(item[key]).toLowerCase().includes(lowercasedFilter)
          );
        });
        setFilteredCourse(filteredData);
      };
      
      useEffect(() => {
        filterCourse();
      }, [searchQuery, course]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.studentItem,
                selectedCourse.find(course => course.id === item.id) ? styles.selectedItem : null,
            ]}
            onPress={() => handleSelectCourse(item)}
        >
            <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Course Code: </Text>{item.code}</Text>
            <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Course Name: </Text>{item.name}</Text>
            <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Department: </Text>{item.department}</Text>
            <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Semester: </Text>{item.semester}</Text>
            <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Credit_hour: </Text>{item.credit_hour}</Text>
        </TouchableOpacity>
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
                    data={filteredCourse}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    extraData={selectedCourse}
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
    selectedItem: {
        backgroundColor: '#6b6b96',
    },
    style: {
        fontSize: 14,
        color: 'white',
        marginBottom: 4,
        fontWeight: '300',
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
    },
});

export default Registration;
