import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { Searchbar } from 'react-native-paper';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredJob, setFilteredJob] = useState([]);

    useEffect(() => {
        handleJobs();
    }, []);

    const handleJobs = async () => {
        try {
//            const response = await axios.get('http://192.168.0.106:8000/api/job/show');
           const response = await axios.get('http://192.168.195.191:8000/api/job/show');
           if (response.data && response.data.data && response.data.data.data) {
                console.log(response.data.data.data);
                setJobs(response.data.data.data);
                setFilteredJob(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError(error.message);
        }
    };
    const filterJob = () => {
        const lowercasedFilter = searchQuery.toLowerCase();
        const filteredData = jobs.filter(item => {
          return Object.keys(item).some(key =>
            String(item[key]).toLowerCase().includes(lowercasedFilter)
          );
        });
        setFilteredJob(filteredData);
      };
      
      useEffect(() => {
        filterJob();
      }, [searchQuery, jobs]);

    const renderItem = ({ item }) => (
        <View style={styles.studentItem}>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>Title: </Text>{item.title}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>Company: </Text>{item.company}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}} >Location: </Text>{item.location}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>Description: </Text>{item.description}</Text>
            <Text style={styles.style}><Text style={{fontWeight:'500', color:'white'}}>Email: </Text>{item.contact_email}</Text>
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
                    data={filteredJob}
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
        color:'white',
        marginBottom: 4,
        fontWeight:'300',
    },
    email: {
        fontSize: 16,
        marginBottom: 4,
    },
    department: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
      //  marginTop: 20,
    },
});

export default Jobs;
