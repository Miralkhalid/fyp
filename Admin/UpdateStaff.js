import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Searchbar } from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const UpdateStaff = () => {
  const [staff, setStaff] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStaff, setFilteredStaff] = useState([]);
  const navigation = useNavigation(); // Use the hook here

  const handleStaff = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.get('http://192.168.0.106:8000/api/admin/staff/list', {
//       const response = await axios.get(`${ip}/api/admin/staff/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data.data);
      if (response.data.data) {
        setStaff(response.data.data);
        setFilteredStaff(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching student list:', error);
      setError(error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleStaff();
    }, [])
  );

  const filterStaff = () => {
    const lowercasedFilter = searchQuery.toLowerCase();
    const filteredData = staff.filter(item => {
      return Object.keys(item).some(key =>
        String(item[key]).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredStaff(filteredData);
  };

  useEffect(() => {
    handleStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchQuery, staff]);

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const response = await axios.delete(`http://192.168.0.106:8000/api/admin/staff/delete/${id}`, {
//     const response = await axios.get.delete(`${ip}/api/admin/staff/delete/${id}` {
       headers: {
         Authorization: `Bearer ${token}`
       },
             });
      if (response.status === 200) {
        handleStaff();
        Alert.alert('Staff deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      setError(error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Id: </Text>{item.id}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Email: </Text>{item.email}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Name: </Text>{item.name}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Password: </Text>{item.password}</Text>
      <Text style={styles.style}><Text style={{ fontWeight: '500', color: 'white' }}>Date of Birth: </Text>{item.date_of_birth}</Text>
      <View style={styles.btncon}>
        <TouchableOpacity style={styles.updateButton} onPress={() => navigation.navigate('UpdateStaffDetail', { id: item.id, email: item.email, password: item.password })}>
          <Text style={styles.deleteButtonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.assignButton} onPress={() => navigation.navigate('AssignCourses', { staffId: item.id })}>
          <Text style={styles.deleteButtonText}>Assign Courses</Text>
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
          data={filteredStaff}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
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
    padding: 10,
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
    marginEnd: 5,
    padding: 10,
  },
  assignButton: {
    backgroundColor: '#8c8c9f',
    width: '30%',
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

export default UpdateStaff;
