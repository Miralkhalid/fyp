import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';

const StudentRecord = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleStudent = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await axios.get('http://192.168.0.106:8000/api/admin/student/list', {
//       const response = await axios.get('http://192.168.195.191:8000/api/admin/student/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);
      if (response.data.data) {
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
      setError(error.message);
    }
  };

  useLayoutEffect(() => {
    handleStudent();
  }, []);

  const filterStudents = () => {
    const lowercasedFilter = searchQuery.toLowerCase();
    const filteredData = students.filter(item => {
      return Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredStudents(filteredData);
  };

  useEffect(() => {
    filterStudents();
  }, [searchQuery, students]);

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');

      const response = await axios.delete(`http://192.168.166.191:8000/api/admin/student/delete/${id}`, {
//       const response = await axios.delete(`http://192.168.195.191:8000/api/admin/student/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        handleStudent();
        Alert.alert('Student deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setError(error.message);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await handleStudent();
    setRefreshing(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Id: </Text>{item.id}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Email: </Text>{item.email}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Name: </Text>{item.name}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Student Id: </Text>{item.student_id}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Date of Birth: </Text>{item.date_of_birth}</Text>
      <View style={styles.btncon}>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateStudent', { id: item.id, email: item.email})}>
          <Text style={styles.deleteButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gradeButton} onPress={() => navigation.navigate('UploadGrades', item.id )}>
          <Text style={styles.deleteButtonText}>Grade</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ backgroundColor: '#cdcddb' }}
      />
      {error ? (
        <Text style={styles.error}>Error: {error}</Text>
      ) : (
        <FlatList
          data={filteredStudents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  studentItem: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#3b3b66',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  style: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
    fontWeight: '300',
  },
  deleteButton: {
    backgroundColor: '#8c8c9f',
    width: '20%',
    borderRadius: 5,
    padding: 2,
  },
  deleteButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  btncon: {
    flex: 1,
    flexDirection: 'row',
  },
  updateButton: {
    backgroundColor: '#8c8c9f',
    width: '20%',
    borderRadius: 5,
    padding: 2,
    marginEnd: 5,
  },
  gradeButton: {
    backgroundColor: '#8c8c9f',
    width: '20%',
    borderRadius: 5,
    padding: 2,
    marginStart: 5,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default StudentRecord;


