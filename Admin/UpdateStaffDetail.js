import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateStaffDetail = ({ route, navigation }) => {
  const { id, email, name, date_of_birth, status, onUpdate } = route.params;
  const [newEmail, setNewEmail] = useState(email);
  const [newStatus, setNewStatus] = useState(status);
  const [newName, setNewName] = useState(name);
  const [newPassword, setNewPassword] = useState('');
  const [newDateOfBirth, setNewDateOfBirth] = useState(date_of_birth);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const updatedData = {
        email: newEmail,
        name: newName,
        status: newStatus,
        date_of_birth: newDateOfBirth,
      };

      const response = await axios.post(`http://192.168.0.106:8000/api/admin/staff/update/${id}`, updatedData, {
//       const response = await axios.post(`http://192.168.195.191:8000/api/admin/staff/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        setErrors({ general: 'Failed to update staff' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response && error.response.status === 422) {
        const errorMessages = error.response.data.errors;
        setErrors(errorMessages);
      } else {
        setErrors({ general: 'Failed to update student' });
      }
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView>
        <Image source={require('./download.png')} style={{height:'22%', width:'35%', alignSelf:'center'}}></Image>

      <Text style={styles.text}>Update Staff Details</Text>
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
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newName}
        onChangeText={setNewName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.join(', ')}</Text>}

      <TextInput
        placeholder='New Password'
        placeholderTextColor={'#cdcddb'}
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
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

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
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
  button: {
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
    marginBottom: 8,
  },
});

export default UpdateStaffDetail;

