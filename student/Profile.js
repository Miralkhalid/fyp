import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ip } from './global';

const Profile = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [id, setId] = useState(null); // Initialize as null
    const [editing, setEditing] = useState(false);


    const fetchProfileData = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const studentId = await AsyncStorage.getItem('studentId'); // Retrieve user ID from AsyncStorage
            setId(studentId); // Set the user ID

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
             const response = await axios.get(`http://192.168.166.191:8000/api/profile/edit/${studentId}`, config);
            const { data } = response.data; // Destructure the response
            const { name, email } = data.user; // Adjust based on actual response structure
            setName(name);
            setEmail(email);
            setRole(role);
        } catch (error) {
            console.error('Error fetching profile details:', error);
            Alert.alert('Error', 'Failed to fetch profile details');
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const userId = await AsyncStorage.getItem('studentId'); // Retrieve user ID from AsyncStorage
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
             const response = await axios.post(`http://192.168.166.191:8000/api/profile/update/${userId}`, {
                name: name,
                email: email,
                role: role,
            }, config);

            if (response.status === 200) {
                Alert.alert('Success', 'Profile updated successfully');
                setEditing(true); // Exit editing mode after save
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'An error occurred while updating your profile');
        }
    };
    const handleLogout = async () => {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={require('./LSIT.png')} style={{ height: '100%', width: '100%' }} >
                <View style={styles.profileInfo}>
                <Text style={styles.title}>Profile</Text>
                <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        editable={editing}
                        placeholder="Name"
                    />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        editable={editing}
                        placeholder="Email"
                    />
                    <TextInput
                        style={styles.input}
                        value={role}
                        onChangeText={setRole}
                        editable={editing}
                        placeholder="Role"
                        placeholderTextColor={'#cdcddb'}
                    />
                </View>
                {editing ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setEditing(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setEditing(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        height: '100%',
        width: '100%',
    },
    title: {
        marginTop: '70%',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
        // marginHorizontal: '10%',
        color: '#3b3b66',
    },
    profileInfo: {
        marginTop:'10%',
        width: '80%',
        marginBottom: 15,
        marginHorizontal: '10%',
    },
    input: {
        // paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#8c8c9f',
        // backgroundColor: '#fff',
        borderRadius: 5,
        borderLeftWidth:1,
        borderColor:'#3b3b66',
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#3b3b66",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: '25%',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '700',
    },

});
export default Profile;
