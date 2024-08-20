import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Picker } from '@react-native-picker/picker';

const StudentAttendance = () => {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch courses when the component mounts
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/staff/assign-courses'); // Adjust the API endpoint as needed
        setCourses(response.data.courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        Alert.alert('Error', 'Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await axios.post('http://192.168.0.106:8000/api/mark-attendance', {
        course_id: courseId,
        student_id: studentId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Attendance marked successfully');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      Alert.alert('Error', 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>

      <Text style={styles.label}>Course:</Text>
      <Picker
        selectedValue={courseId}
        style={styles.picker}
        onValueChange={(itemValue) => setCourseId(itemValue)}
      >
        {courses.map((course) => (
          <Picker.Item key={course.id} label={course.name} value={course.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Student ID:</Text>
      <TextInput
        style={styles.input}
        value={studentId}
        onChangeText={setStudentId}
        keyboardType="numeric"
        placeholder="Enter your student ID"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleMarkAttendance}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Mark Attendance'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b3b66',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudentAttendance;
