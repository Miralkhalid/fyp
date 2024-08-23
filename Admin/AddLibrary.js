import React, { useState } from 'react';
import { View, TextInput, Image, Alert, StyleSheet, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.166.191:8000/api';
// const API_URL = 'http://192.168.195.191:8000/api';

const AddLibrary = ({navigation}) => {
  const [book_name, setBookName] = useState('');
  const [author_name, setAuthorName] = useState('');
  const [published_year, setPublishesYear] = useState('');

  const handleAddBook = async () => {
    if (!book_name || !author_name || !published_year) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('jwtToken')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.post(`${API_URL}/book/store`, {
        book_name,
        author_name,
        published_year,
      }, config);
      if (response.data) {
        Alert.alert('Success', 'Book added successfully');
        resetForm();
      }
    } catch (error) {
      console.error('Error adding book', error);
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
    setBookName('');
    setAuthorName('');
    setPublishesYear('');
  };

  return (
    <ScrollView>
      <View style={styles.container}>
      <Text style={styles.title}>Library</Text>
      <View style={styles.horizontal}></View>
      <View style={{marginVertical:'5%'}}>
      <Text style={styles.text}>Enter Book credentials</Text>
      <TextInput
        placeholder="Book Name"
        placeholderTextColor={'#cdcddb'}
        value={book_name}
        onChangeText={setBookName}
        style={styles.input}
      />
      <TextInput
        placeholder="Author Name"
        placeholderTextColor={'#cdcddb'}
        value={author_name}
        onChangeText={setAuthorName}
        style={styles.input}
      />
      <TextInput
        placeholder="Publishes Year"
        placeholderTextColor={'#cdcddb'}
        value={published_year}
        onChangeText={setPublishesYear}
        style={styles.input}
      />
        <TouchableOpacity style={styles.button} onPress={handleAddBook} >
          <Text style={styles.buttonText}>Add Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.UpdateBtn} onPress={() => navigation.navigate('BookList')} >
          <Text style={styles.buttonText}>Book List</Text>
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
     height:'150%',
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
    borderLeftWidth:1,
    borderRightWidth:1,
    borderBottomWidth:2,
    borderColor: '#3b3b66',
    borderRadius:10,
    marginBottom: 12,
    paddingHorizontal: 8,
    width:'80%',
    color:'#3b3b66',
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
  UpdateBtn:{
    backgroundColor: "#8c8c9f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf:'center',
    width:'80%',
    // marginHorizontal:'25%',
    marginTop:5,
    marginBottom:'30%'
  }
});

export default AddLibrary;
