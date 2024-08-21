import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Idcard = () => {
  const [studentCard, setStudentCard] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        // Retrieve student_id from AsyncStorage
        const id = await AsyncStorage.getItem('student_card', 'studentId');
        setId(studentId); // Set the user ID

        // Log the retrieved student_id
        console.log(`Retrieved student ID: ${id}`);
        
        // Fetch card details from API
        console.log(`Fetching card details for student ID: ${id}`);
        const response = await axios.get(`http://192.168.0.106:8000/api/student/get-card-detail/${id}`);
        
        // Log the API response
        console.log('API Response Data:', response);
        
        // Check if response contains data
        if (response.data.status === 200 && response && response.data.data) {
          console.log(response.data.data);
          setStudentCard(response.data.data); // Set student card data
        } else {
          Alert.alert('Error', 'Failed to fetch card details');
          console.log('Failed to fetch card details. Response:', response);
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log('Student Card Data:', studentCard); // Log student card data

  return (
    <View style={styles.container}>
      <ImageBackground source={require('./idcard.png')} style={styles.backgroundImage}>
        <Text style={styles.caption}>LAHORE SCHOOL OF INNOVATION & TECHNOLOGY</Text>
        {error ? (
          <Text style={styles.error}>Error: {error}</Text>
        ) : studentCard ? (
          <View style={styles.cardItem}>
            <Text style={styles.style}><Text style={styles.label}>Name: </Text>{studentCard.name}</Text>
            <Text style={styles.style}><Text style={styles.label}>Email: </Text>{studentCard.email}</Text>
            <Text style={styles.style}><Text style={styles.label}>Phone No: </Text>{studentCard.phone_no}</Text>
            <Text style={styles.style}><Text style={styles.label}>Address: </Text>{studentCard.address}</Text>
            <Text style={styles.style}><Text style={styles.label}>Create Date: </Text>{studentCard.create_date}</Text>
          </View>
        ) : (
          <Text style={styles.empty}>No data available</Text>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caption: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardItem: {
    padding: 20,
  },
  style: {
    fontSize: 16,
    marginBottom: 10,
  },
  label: {
    fontWeight: '700',
    color: '#cdcddb',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
  },
});

export default Idcard;