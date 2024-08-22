import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, TouchableRipple } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AssignCourses = ({ route, navigation }) => {
  const { staffId } = route.params; // Get staffId from route params
  console.log(staffId);
  const [courses, setCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState(null);
const API_URL = 'http://192.168.0.106:8000/api';
  useEffect(() => {
    handleCourse();
  }, []);

  const handleCourse = async () => {
    try {
//      const response = await axios.get('http://192.168.0.106:8000/api/course/list');
       const response = await axios.get(`{API_URL}/api/course/list`);
      if (response.data && response.data.data && response.data.data.data) {
        setCourses(response.data.data.data);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const validateSelection = () => {
    if (selectedCourses.length === 0) {
      Alert.alert('Validation Error', 'Please select at least one course.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSelection()) {
      return;
    }

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      console.log({selectedCourses});
      const assignresult = await axios.post(
        `http://192.168.195.191:8000/api/admin/staff/${staffId}/assign-courses`,
        { course_ids: selectedCourses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({assignresult});
      Alert.alert('Success', 'Courses assigned to staff member successfully');
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      Alert.alert('Error', 'Failed to assign courses');
      console.log(error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableRipple
      onPress={() => handleSelectCourse(item.id)}
      style={[
        styles.item,
        selectedCourses.includes(item.id) && styles.selectedItem,
      ]}
    >
      <View>
      <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Course Id: </Text>
          {item.id} </Text>
        <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Course Code: </Text>
          {item.code} </Text>
        <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Course Name: </Text>
          {item.name}  </Text>
        <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Department: </Text>
          {item.department}  </Text>
        <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Semester: </Text>
          {item.semester} </Text>
        <Text style={styles.style}>
          <Text style={{ fontWeight: '500', color: 'white' }}>Credit_hour: </Text>
          {item.credit_hour}  </Text>
      </View>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
        <>
          <FlatList
            data={courses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Assign Courses
          </Button>
        </>
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
  selectedItem: {
    backgroundColor: '#cdcddb',
  },
  style: {
    fontSize: 14,
    color: 'white',
    backgroundColor: '#3b3b66',
    fontWeight: '300',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#cdcddb',
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default AssignCourses;

