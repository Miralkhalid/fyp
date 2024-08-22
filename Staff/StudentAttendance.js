import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, RadioButton, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from './global';

const StudentAttendance = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the students list from the API
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://192.168.0.106:8000/api/staff/assign-courses`); // Replace with your actual endpoint;
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prevState => ({
      ...prevState,
      [studentId]: !prevState[studentId] // Toggle the attendance status
    }));
  };
  const handleSubmit = async () => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}` // Corrected the syntax here
            }
        };

        console.log('JWT Token:', token); // Check the token value here
        console.log('Selected Students:', selectedStudents);

        const data = {
            course_id: 2,
            students: [
                { id: 2, attendance: 'leave' },
                { id: 1, attendance: 'absent' }
            ]
        };

        const response = await axios.post(`${ip}/api/staff/mark-student-attendance`,
            data, // Data is passed here as the second argument
            config
        );

        console.log('Response:', response);
        alert('Attendance marked successfully!');
    } catch (error) {
        console.error('Error marking attendance:', error);
        alert('Error marking attendance');
    }
};


//   const handleSubmit = async () => {
//     try {
//         const token = await AsyncStorage.getItem('jwtToken');
//         const config = {
//             headers: {
//               Authorization: `Bearer ${token}` // Corrected the syntax here
//             }
//           };
//         console.log('JWT Token:', token); // Check the token value here
//         console.log('selected', selectedStudents);

//         const response = await axios.post(
//             'http://192.168.0.106:8000/api/staff/mark-student-attendance',
//             data: {
//                 course_id: 2,
//                 students: [
//                     // { id: 11, attendance: 'leave' },
//                     { id: 13, attendance: 'absent' }
//                 ]
//             },
//             config,
//         );

//         console.log('response', response);
//         alert('Attendance marked successfully!');
//     } catch (error) {
//         console.error('Error marking attendance:', error);
//         alert('Error marking attendance');
//     }
// };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {students.length > 0 ? (
        students.map(student => (
          <View key={student.id} style={styles.studentContainer}>
            <Text style={styles.studentName}>{student.name}</Text>
            <RadioButton
              value={student.id}
              status={selectedStudents[student.id] ? 'checked' : 'unchecked'}
              onPress={() => handleSelectStudent(student.id)}
            />
          </View>
        ))
      ) : (
        <Text>No students available</Text>
      )}
           <TouchableOpacity style={styles.button2} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Attendance</Text>
            </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    height:'100%',
    padding: 16,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentName: {
    flex: 1,
    color:'#3b3b66',
    fontSize: 16,
  },
  button2: {
    backgroundColor: '#3b3b66',
    paddingVertical: 12,
     alignSelf:'center',
    borderRadius: 10,
    marginTop: 5,
    width:'70%',
},
buttonText: {
    textAlign: 'center',
    color: 'white',
    // fontWeight: '500',
    fontSize: 14,
},
});

export default StudentAttendance;
