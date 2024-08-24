
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper'; // Ensure this library is installed

const StudentAttendance = ({ route }) => {
  const { id } = route.params;
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the students list from the API
    const fetchStudents = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await axios.get(
          `http://192.168.0.106:8000/api/staff/getCourseStudent/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extract the student data
        if (response && response.data && response.data.data && response.data.data.Student) {
          console.log('Fetched Students:', response.data.data.Student);
          setStudents(response.data.data.Student);
        } else {
          console.error('Unexpected response format:', response);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [id]);

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prevState => ({
      ...prevState,
      [studentId]: !prevState[studentId], // Toggle the attendance status
    }));
  };

 const handleSubmit = async () => {
   try {
     // Retrieve the JWT token from AsyncStorage
     const token = await AsyncStorage.getItem('jwtToken');

     // Configuration for the Axios request
     const config = {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     };

     // Log the token and selected students for debugging
     console.log('JWT Token:', token);
     console.log('Selected Students:', selectedStudents);

     // Prepare the data payload to send in the POST request
     const data = {
       course_id: id, // Ensure 'id' is defined and passed from the route params or context
       students: Object.keys(selectedStudents).map(studentId => ({
         id: parseInt(studentId, 10), // Ensure the ID is parsed as an integer
         attendance: selectedStudents[studentId] ? 'present' : 'absent', // Adjust attendance logic if needed
       })),
     };

     // Log the data for debugging
     console.log('Payload Data:', data);

     // Send the POST request to mark attendance
     const response = await axios.post(
       'http://192.168.0.106:8000/api/staff/mark-student-attendance',
       data,
        config
     );

     // If the response is successful, log and alert the user
     if (response) {
       console.log('Attendance Response:', response);
     }

     alert('Attendance marked successfully!');
   } catch (error) {
     // Log the error and alert the user in case of failure
     console.error('Error marking attendance:', error.message);
     alert('Error marking attendance');
   }
 };

 // Handle loading state (this should be part of your component render logic)
 if (loading) {
   return <ActivityIndicator size="large" color="#0000ff" />;
 }

 // Log the selected students for debugging outside of the async function
 console.log('Selected Students:', selectedStudents);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {students.length > 0 ? (
        students.map(student => (
          <View key={student.id} style={styles.studentContainer}>
            <Text style={styles.studentName}>{student.name}</Text>
            <RadioButton
              value={student.id.toString()}
              status={selectedStudents[student.id] ? 'checked' : 'unchecked'}
              onPress={() => handleSelectStudent(student.id)}
              disabled = {student.attendance === "present" || student.attendance === "leave" || student.attendance === "absent" }
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
    marginTop: 20,
    width:'70%',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
});

export default StudentAttendance;
