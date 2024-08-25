import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity,ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Issue() {
  const [book_id, setBookId] = useState('');
  const [from_date, setFromDate] = useState('');
  const [to_date, setToDate] = useState('');

  const handleRequest = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      console.log('JWT Token:', token); // Check the token value here
        const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post('http://192.168.0.106:8000/api/book/request',
        {
          book_id,
          from_date,
          to_date
        },
        config // Include the config here
      );
 if(response){
      console.log(response);
      }
      alert('Request sent successfully!');
    } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      alert('Failed to send request.');
    }
  };

  return (
    <View style={styles.container}>
    <ScrollView>
     <View style={styles.form}>
      <Text style={styles.label}>Book Id</Text>
      <TextInput
             style={styles.input}
             value={book_id}
             onChangeText={setBookId}
             placeholder="Book Id"
             placeholderTextColor="#ccc"
           />
      <Text style={styles.label}>Start Date</Text>
      <TextInput
        style={styles.input}
        value={from_date}
        onChangeText={setFromDate}
        placeholder="day-month-year"
        placeholderTextColor="#ccc"
      />
      <Text style={styles.label}>End Date</Text>
      <TextInput
        style={styles.input}
        value={to_date}
        onChangeText={setToDate}
        placeholder="day-month-year"
        placeholderTextColor="#ccc"
      />
     <View style={styles.btncon}>
         <TouchableOpacity style={styles.sendButton} onPress={handleRequest} >
     <Text style={styles.sendButtonText}>Send Request</Text>
     </TouchableOpacity>
    </View>
    </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'white',
    height:'100%',
},
form:{
    backgroundColor: '#3b3b66',
    justifyContent:'center',
//    alignItems:'center',
    alignSelf:'center',
    borderRadius:10,
    width:'80%',
    marginVertical:'45%',
    height:'60%',
},
  label: {
    fontSize: 16,
    textAlign:'left',
    marginBottom: 8,
    color: 'white',
    marginHorizontal:'20%',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius:5,
    alignSelf:'center',
    width:'60%',
    marginBottom: 16,
    paddingHorizontal: 8,
    color: 'white',
  },
    sendButton: {
    backgroundColor: '#8c8c9f',
    width: '60%',
    alignSelf:'center',
    borderRadius: 5,
//    marginEnd: 5,
    padding: 5,
  },
   sendButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight:'600',
     },
});
