import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

const StaffCourse = ({navigation}) => {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourse, setFilteredCourse] = useState([]);

    useLayoutEffect(() => {
   
        handleCourse();
    }, []);

    const handleCourse = async () => {
        // console.log(code, name, department,semester,credit_hour);
    //     const staffId= await AsyncStorage.getItem('staffId');
    // console.log({staffId});
    const value = await AsyncStorage.getItem('staffId');
   console.log(value);
   let staffId;
    if (value) {
      staffId = JSON.parse(value);
      console.log('Retrieved Staff ID:', staffId);}
        try {
            const token = await AsyncStorage.getItem('jwtToken');

            const response = await axios.get(`http://192.168.0.106:8000/api/admin/staff/${staffId}/courses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.data.courses) {
                console.log(response.data.data.courses);
                setCourse(response.data.data.courses);
                setFilteredCourse(response.data.data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError(error.message);
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
        <View style={styles.studentItem}>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>id: </Text>{item.id}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>code: </Text>{item.code}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>name: </Text>{item.name}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}} >department: </Text>{item.department}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>semester: </Text>{item.semester}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>credit_hour: </Text>{item.credit_hour}</Text>
            <View style={styles.btncon}>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('StudentAttendance')}>
          <Text style={styles.Text}>Attendance</Text>
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
                    data={filteredCourse}
                    renderItem={renderItem}
                    // keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={<Text style={styles.empty}>No courses available</Text>}
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
    btncon: {
        flex: 1,
        flexDirection: 'row',
      },
      Text:{
        color:'white',
        textAlign:'center',
      },
      updateButton: {
        backgroundColor: '#8c8c9f',
        width: '30%',
        borderRadius: 5,
        marginEnd: 5,
        padding: 10,
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
        color:'white',
        marginBottom: 4,
        fontWeight:'300',
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
});

export default StaffCourse;
