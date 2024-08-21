import React, { useLayoutEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Image, ScrollView,Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudentRecord from './StudentRecord';

const UpdateStudent = ({ route, navigation }) => {
  const { id, email, name, password, date_of_birth, status } = route.params;
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newStudentId, setNewStudentId] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState('');

  const [errors, setErrors] = useState({});

  const handleStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await axios.get(`http://192.168.0.106:8000/api/admin/student/show/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);
      if (response.data.data) {
        setNewPassword(response.data.data['student'].password);
        setNewDateOfBirth(response.data.data['student'].date_of_birth);
        setNewName(response.data.data['student'].name);
        setNewEmail(response.data.data['student'].email);
        setNewStatus(response.data.data['student'].status);
        setNewStudentId(response.data.data['student'].student_id);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
      // setError(error.message);
    }
  };
useLayoutEffect( () => {
  handleStudent();
}, [id]);

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const updatedData = {
        email: newEmail,
        name: newName,
        status: newStatus === '1', // Convert status to boolean if needed
        password: newPassword,
        student_id: newStudentId, // Corrected key to match backend
        date_of_birth: newDateOfBirth,
      };
  
      const url = `http://10.0.2.2:8000/api/admin/student/update/${id}`;
      console.log(`URL: ${url}`);
      console.log('Updated Data:', updatedData);
  
      const response = await axios.post(url, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        console.log('Student updated successfully');
        Alert.alert('update Student');
        navigation.navigate('StudentRecord'); // Corrected navigation
      } else {
        setErrors({ general: 'Failed to update student' });
      }
    } catch (error) {
      console.error('Error updating student:', error.message);
      if (error.response) {
        console.error('Error details:', error.response.data);
        setErrors({ general: error.response.data.message || 'Failed to update student' });
      } else {
        setErrors({ general: 'Failed to update student' });
      }
    }
  };
  
  return (
    <View style={styles.container}>
        <ScrollView>
        <Image source={require('./download.png')} style={{height:'22%', width:'35%', alignSelf:'center'}}></Image>
      <Text style={styles.text}>Update Student Detail</Text>
       <TextInput
        placeholder='Email'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newEmail}
        onChangeText={setNewEmail}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.join(', ')}</Text>}
      
      <TextInput
        placeholder='Name'
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.join(', ')}</Text>}
      
      <TextInput
        placeholder='Password'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.join(', ')}</Text>}

      <TextInput
        placeholder='Student Id'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newStudentId}
        onChangeText={setNewStudentId}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.join(', ')}</Text>}
      
      <TextInput
        placeholder='Date of Birth'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newDateOfBirth}
        onChangeText={setNewDateOfBirth}
      />
      {errors.date_of_birth && <Text style={styles.errorText}>{errors.date_of_birth.join(', ')}</Text>}
      
      <TextInput
        placeholder='Status'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newStatus}
        onChangeText={setNewStatus}
      />
      {errors.status && <Text style={styles.errorText}>{errors.status.join(', ')}</Text>}
      
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    height:'100%',
    backgroundColor: 'white',
  },
  text: {
    color: '#3b3b66',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '5%',
    fontSize: 16,
    marginVertical: '10%',
  },
  input: {
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:2,
    borderColor: '#3b3b66',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    color: '#3b3b66',
    marginHorizontal: '5%',
  },
  saveButton: {
    backgroundColor: '#3b3b66',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginHorizontal: '5%',
    marginTop: 20,
    marginBottom:'20%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginHorizontal: '5%',
    marginBottom: 15,
  },
});

export default UpdateStudent;


