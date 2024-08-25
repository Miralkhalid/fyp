import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, StyleSheet, ImageBackground, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdCard = ({ route }) => {
//  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [studentCard, setStudentCard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const studentId = await AsyncStorage.getItem('studentId');
        const token = await AsyncStorage.getItem('jwtToken');

        // Log the retrieved student ID and token
        console.log(`Retrieved student ID: ${studentId}`);
        console.log(`Retrieved JWT Token: ${token}`);

        if (!studentId) {
          Alert.alert('Error', 'Student ID not found in storage');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        console.log(`Fetching card details for student ID: ${studentId}`);
        const response = await axios.get(`http://192.168.0.106:8000/api/student/get-card-detail/${studentId}`, config);

        if (response.status === 200 && response.data.data) {
          setStudentCard([response.data.data]); // Wrap the response data in an array
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

  const renderItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.text}> LAHORE SCHOOL OF INNOVATION AND TECHNOLOGY</Text>
      <View style={styles.horizontal}></View>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>ID: </Text> {item.id}</Text>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>Name: </Text> {item.name}</Text>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>Email: </Text>{item.email}</Text>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>Phone: </Text> {item.phone_no}</Text>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>Address: </Text>{item.address}</Text>
      <Text style={styles.cardText}><Text style={{ fontWeight: '500', color: 'white' }}>Create Date: </Text>{item.create_date}</Text>
    </View>
  );

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
      <ImageBackground source={require('./idcard.png')} style={{ height: '100%' }}>
        <FlatList
          data={studentCard}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text style={styles.errorText}>No card data found</Text>}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardText: {
    fontSize: 14,
    marginVertical: 5,
    marginHorizontal:'7%',
    color: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
  },
  studentItem: {
    marginHorizontal: '20%',
    marginVertical: '50%',
  },
   horizontal: {
        marginTop:5,
        backgroundColor: 'white',
//        marginHorizontal:'10%',
        alignSelf:'center',
        width: 150,
        height: 1,
      },
  text:{
  color:'white',
  marginBottom:'10%',
  textAlign:'center',
  fontWeight:'600',
  }
});

export default IdCard;
