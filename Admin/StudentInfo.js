import React, { useState } from 'react';
  import { View, TextInput, Image, Alert, StyleSheet, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';

  const StudentInfo = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [student_id, setStudentId] = useState('');
    const [status, setStatus] = useState(true);
    const [dateOfBirth, setDateOfBirth] = useState('');

    const handleAddStudent = async () => {
      if (!email || !name || !password || !dateOfBirth) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      // Additional frontend validation for student ID format
      const studentIdPattern = /^[A-Za-z0-9-]+$/; // Adjust this regex to match the expected format
      if (!studentIdPattern.test(student_id)) {
        Alert.alert('Error', 'Invalid Student ID format');
        return;
      }

      try {
        // const token = '95|5zMS9hVAizfu2Qs5dSwc7jt2XNetXDTRI1FNejQa8999b085';
        const token = await AsyncStorage.getItem('jwtToken')
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Corrected the syntax here
          }
        };
//        const response = await axios.post(`http://192.168.0.106:8000/api/admin/student/create`, {
         const response = await axios.post('http://192.168.166.191:8000/api/admin/student/create', {
          email,
          name,
          password,
          status,
          student_id,
          date_of_birth: dateOfBirth,
        }, config);
        if (response.data) {
          Alert.alert('Success', 'Student added successfully');
          resetForm();
        }
      } catch (error) {
        console.error('Error adding student', error);
        if (error.response) {
          const errors = error.response.data.errors;
          if (errors && Object.keys(errors).length > 0) {
            const firstErrorKey = Object.keys(errors)[0];
            Alert.alert('Validation Error', errors[firstErrorKey][0]); // Display the first validation error
          } else {
            Alert.alert('Error', error.response.data.message || 'Failed to add student');
          }
        } else {
          Alert.alert('Error', 'Network error. Please try again later.');
        }
      }
    }
    const resetForm = () => {
      setEmail('');
      setName('');
      setPassword('');
      setDateOfBirth('');
      setStudentId('');
    };
 return (
      <ScrollView>
        <View style={styles.container}>
        <Text style={styles.title}>Add Student</Text>
        <View style={styles.horizontal}></View>
        <View style={{marginVertical:'5%'}}>
        <Text style={styles.text}>Enter student credientials</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={'#cdcddb'}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Name"
          placeholderTextColor={'#cdcddb'}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Password 8 Characters"
          placeholderTextColor={'#cdcddb'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          placeholder="Student Id"
          placeholderTextColor={'#cdcddb'}
          value={student_id}
          onChangeText={setStudentId}
          // secureTextEntry={true}
          style={styles.input}
        />
        <TextInput
          placeholder="Date of Birth (DD-MM-YYYY)"
          placeholderTextColor={'#cdcddb'}
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          style={styles.input}
        />
          <TouchableOpacity style={styles.button} onPress={handleAddStudent} >
            <Text style={styles.buttonText}>Create Student</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updatebtn} onPress={() => navigation.navigate('StudentRecord')} >
            <Text style={styles.buttonText}>Student Record</Text>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      padding: 16,
      backgroundColor: '#fff',
      //  height:'150%',
      // flexDirection:'column',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color:'#3b3b66',
      textAlign:'center',
      marginTop:'30%',
    },
    text:{
      color:'#3b3b66',
      fontWeight:'500',
      textAlign:'center',
      marginBottom:'5%',
    },
    input: {
      height: 40,
      borderColor: '#3b3b66',
      borderWidth: 1,
      borderRadius:10,
      marginBottom: 12,
      paddingHorizontal: 8,
      color:'#3b3b66',
      width:'80%',
      alignSelf:'center',
    },
    button: {
      backgroundColor: "#3b3b66",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      width:'80%',
      // marginHorizontal:8,
      alignSelf:'center',
      marginTop:5,
      // marginBottom:'60%',
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    horizontal: {
      marginTop:5,
      backgroundColor: 'black',
      marginHorizontal:'15%',
      width: 250,
      height: 1,
    },
    updatebtn:{
      backgroundColor: "#8c8c9f",
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      alignSelf:'center',
      width:'80%',
      // marginHorizontal:'25%',
      marginTop:5,
      marginBottom:'40%'
    }
  });

  export default StudentInfo;