import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';

const StudentAttendance = ({ route }) => {
  const { id } = route.params;
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleSelectStudent = (studentId, status) => {
    setSelectedStudents(prevState => ({
      ...prevState,
      [studentId]: status, // Set the status (present, absent, leave)
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('JWT Token:', token);
      console.log('Selected Students:', selectedStudents);

      const data = {
        course_id: id,
        students: Object.keys(selectedStudents).map(studentId => ({
          id: parseInt(studentId, 10),
          attendance: selectedStudents[studentId], // Use the selected status directly
        })),
      };

      console.log('Payload Data:', data);

      const response = await axios.post(
        'http://192.168.0.106:8000/api/staff/mark-student-attendance',
        data,
        config
      );

      if (response) {
        console.log('Attendance Response:', response);
      }

      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error.message);
      alert('Error marking attendance');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Student Name</Text>
        <Text style={styles.headerText}>Present</Text>
        <Text style={styles.headerText}>Absent</Text>
        <Text style={styles.headerText}>Leave</Text>
      </View>
      {students.length > 0 ? (
        students.map(student => (
          <View key={student.id} style={styles.studentContainer}>
            <Text style={styles.studentName}>{student.name}</Text>
            <RadioButton
              value="present"
              status={selectedStudents[student.id] === 'present' ? 'checked' : 'unchecked'}
              onPress={() => handleSelectStudent(student.id, 'present')}
              disabled={student.attendance === "present" || student.attendance === "leave" || student.attendance === "absent"}
            />
            <RadioButton
              value="absent"
              status={selectedStudents[student.id] === 'absent' ? 'checked' : 'unchecked'}
              onPress={() => handleSelectStudent(student.id, 'absent')}
              disabled={student.attendance === "present" || student.attendance === "leave" || student.attendance === "absent"}
            />
            <RadioButton
              value="leave"
              status={selectedStudents[student.id] === 'leave' ? 'checked' : 'unchecked'}
              onPress={() => handleSelectStudent(student.id, 'leave')}
              disabled={student.attendance === "present" || student.attendance === "leave" || student.attendance === "absent"}
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
    backgroundColor: 'white', // Light blue background for a fresh look
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#3b3b66', // Matching the button color for consistency
    fontSize: 12,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  studentName: {
//    flex: 2,
    color: 'black',
    fontSize: 14,
    fontWeight: '600',
  },
  button2: {
    backgroundColor: '#3b3b66',
    paddingVertical: 15,
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
});


export default StudentAttendance;
