import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';

const API_URL = 'http://192.168.0.106:8000/api';
const CourseList = () => {
    const [course, setCourse] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCourse, setFilteredCourse] = useState([]);

    useEffect(() => {
        handleCourse();
    }, []);

    const handleCourse = async () => {
        try {
//            const response = await axios.get('http://192.168.0.106:8000/api/course/list');
             const response = await axios.get('http://192.168.195.191:8000/api/course/list');
            if (response.data && response.data.data && response.data.data.data) {
                console.log(response.data.data.data);
                setCourse(response.data.data.data);
                setFilteredCourse(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching course:', error);
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
        <View style={styles.item}>
            <Text style={styles.style}><Text style={{fontWeight:'400', color:'white'}}>Course Code: </Text>{item.code}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'400', color:'white'}}>Course Name: </Text>{item.name}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'400', color:'white'}}>Department: </Text>{item.department}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'400', color:'white'}}>Semester: </Text>{item.semester}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'400', color:'white'}}>Credit_hour: </Text>{item.credit_hour}</Text>
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
                    keyExtractor={(item) => item.id.toString()}
                  //  extraData={selectedCourse}
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
        fontSize: 14,
        color:'white',
        backgroundColor:'#3b3b66',
        fontWeight:'300',
    },
   
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        // marginTop: 20,
    },
});

export default CourseList;
