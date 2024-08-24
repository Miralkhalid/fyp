import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet,ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdCard = () => {
  const [loading, setLoading] = useState(true);
  const [studentCard, setStudentCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const student_id = await AsyncStorage.getItem('student_id');
        const token = await AsyncStorage.getItem('jwtToken');

        // Log the retrieved student ID and token
        console.log(`Retrieved student ID: ${student_id}`);
        console.log(`Retrieved JWT Token: ${token}`);

        if (!student_id) {
          Alert.alert('Error', 'Student ID not found in storage');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        console.log(`Fetching card details for student ID: ${student_id}`);
        const response = await axios.get(`http://192.168.0.106:8000/api/student/get-card-detail/${student_id}`, config);

        if (response.status === 200 && response.data.data) {
          setStudentCard(response.data.data);
        } else {
          Alert.alert('Error', response.data.message || 'Failed to fetch card details');
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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (!studentCard) {
    return <Text style={styles.errorText}>No card data found</Text>;
  }

  return (
    <View style={styles.container}>
    <ImageBackground source={require('./idcard.png')} style={{height:'100%'}}>

    <View style={styles.detail}>
      <Text style={styles.cardText}>Name: {studentCard.name}</Text>
      <Text style={styles.cardText}>Email: {studentCard.email}</Text>
      <Text style={styles.cardText}>Phone Number: {studentCard.phone_no}</Text>
      <Text style={styles.cardText}>Address: {studentCard.address}</Text>
      <Text style={styles.cardText}>Student ID: {studentCard.student_id}</Text>
      <Text style={styles.cardText}>Created At: {studentCard.create_date}</Text>
      </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
//    justifyContent: 'center',
//    alignItems: 'center',
//    padding: 20,
  },
  cardText: {
    fontSize: 14,
    marginVertical: 5,
    color:'white',
  },
  detail:{
  marginHorizontal:'20%',
  marginVertical:'50%'
  },
caption:{
color:'white',
},
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default IdCard;
