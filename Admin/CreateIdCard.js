import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Text, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateIdCard = () => {
  const [id, setDateOfBirth] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone_no, setPhoneNo] = useState('');
  const [address, setAddress] = useState('');
  const [student_id, setStudentId] = useState('');

  const createCard = async () => {
    if (!name || !email || !phone_no || !address || !student_id) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      console.log({ name, email, phone_no, address, student_id });
      const response = await axios.post('http://192.168.0.106:8000/api/student/card-create', {
//       const response = await axios.post('http://192.168.195.191:8000/api/student/card-create', {
        id,
        name,
        email,
        phone_no,
        address,
        student_id,
      });

      if (response.status === 200) {
        // Store id in AsyncStorage
        await AsyncStorage.setItem('student_id', student_id);
        Alert.alert('Success', 'ID Card created successfully');
        console.log(response.data);
      } else {
        throw new Error('Failed to create ID Card');
      }
    } catch (error) {
      console.error('Error creating ID Card:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create ID Card');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={require('./download.png')} style={{height:'17%', width:'25%', alignSelf:'center', marginVertical:'10%'}}></Image>
        <View style={styles.horizontal}></View>
        <View style={styles.form}>
          <Text style={styles.caption}>Enter Student Credentials Here</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor={'#cdcddb'}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            placeholderTextColor={'#cdcddb'}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={phone_no}
            onChangeText={setPhoneNo}
            placeholder="Enter phone number"
            placeholderTextColor={'#cdcddb'}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter address"
            placeholderTextColor={'#cdcddb'}
          />
          <TextInput
            style={styles.input}
            value={student_id}
            onChangeText={setStudentId}
            placeholder="Enter student ID"
            placeholderTextColor={'#cdcddb'}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={createCard}>
            <Text style={styles.buttontext}>Create ID Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    marginVertical: '5%',
  },
  input: {
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:2,
    borderColor: '#3b3b66',
    marginHorizontal: '10%',
    marginTop: 10,
    borderRadius: 10,
    color:'black',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3b3b66',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 10,
    marginHorizontal: '10%',
    marginTop: 20,
    marginBottom:'20%',
  },
  buttontext: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
  },
  caption: {
    color: '#3b3b66',
    fontWeight: '600',
    textAlign: 'center',
    // marginVertical: '5%',
  },
  text: {
    marginHorizontal: 40,
    color: '#3b3b66',
    fontWeight: '500',
  },
  horizontal: {
    marginTop: '3%',
    backgroundColor: 'black',
    width: 250,
    height: 1,
    marginBottom:'2%',
    alignSelf:'center',
  },
});

export default CreateIdCard;
