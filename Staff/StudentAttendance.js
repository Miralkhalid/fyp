import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, RadioButton } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const StudentAttendance = () => {
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://192.168.0.106:8000/api/staff/assign-courses'); // Adjust the API endpoint as needed
        setStudents(response.data.students); // Adjust based on the actual response structure
        // Initialize selected students with empty values
        setSelectedStudents(response.data.students.map(student => ({
          id: student.id,
          name: student.name,
          attended: false
        })));
      } catch (error) {
        console.error('Failed to fetch students:', error);
        Alert.alert('Error', 'Failed to load students');
      }
    };

    fetchStudents();
  }, []);

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      // Filter students who have been marked as attended
      const attendedStudents = selectedStudents.filter(student => student.attended);

      const response = await axios.post('http://192.168.0.106:8000/api/mark-attendance', {
        course_id: courseId,
        students: attendedStudents,
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

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prevState =>
      prevState.map(student =>
        student.id === studentId
          ? { ...student, attended: !student.attended }
          : student
      )
    );
  };

  const renderStudent = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>Student Name{item.name}</Text>
      <RadioButton
        value={item.id}
        status={item.attended ? 'checked' : 'unchecked'}
        onPress={() => handleSelectStudent(item.id)}
      />
    </View>
  );

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

      <Text style={styles.label}>Students:</Text>
      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={item => item.id.toString()}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleMarkAttendance}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Submit Attendance'}</Text>
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
    color:'#3b3b66',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    color:'#3b3b66',

  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color:'#3b3b66',
  },
  button: {
    backgroundColor: '#3b3b66',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudentAttendance;
