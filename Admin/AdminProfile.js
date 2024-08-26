import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet,ScrollView, TouchableOpacity, Image, Alert, ImageBackground } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminProfile = ({ navigation }) => {
    const [user, setUser] = useState({
        id: 0,
        name: '',
        status: 0,
        email: '',
        dateOfBirth: ''
    });
    const [editing, setEditing] = useState(false);
    console.log('user', user);
    const fetchProfileData = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const adminId = await AsyncStorage.getItem('adminId');

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.get(`http://192.168.0.106:8000/api/profile/edit/${adminId}`, config);
            const fetchedUser = response.data.data.user;
                       setUser({
                           id: fetchedUser.id,
                           name: fetchedUser.name,
                           email: fetchedUser.email,
                           status: fetchedUser.status,
                           dateOfBirth: fetchedUser.date_of_birth, // Assuming the API returns 'date_of_birth'
                   });
        } catch (error) {
            console.error('Error fetching profile details:', error);
            Alert.alert('Error', 'Failed to fetch profile details');
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleInputChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const adminId = await AsyncStorage.getItem('adminId');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            };

            // Ensure all fields are filled
            if (!user.name || !user.email || !user.dateOfBirth) {
                Alert.alert('Error', 'All fields are required.');
                return;
            }

            const formData = new FormData();
            formData.append('name', user.name);
            formData.append('email', user.email);
            formData.append('date_of_birth', user.dateOfBirth);
            formData.append('status', user.status ? 1 : 1);

            const response = await axios.post(
                `http://192.168.0.106:8000/api/profile/update/${adminId}`,
                formData,
                config
            );

            if (response.status === 200) {
                Alert.alert('Success', 'Profile updated successfully');
                setEditing(false);
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'An error occurred while updating your profile');
        }
    };

    const handleLogout = async () => {
        navigation.navigate('Admin');
    };

    return (
        <View style={styles.container}>
        <ScrollView>
            <ImageBackground source={require('./LSIT.png')} style={styles.backgroundImage}>
                <Text style={styles.title}>Profile</Text>
                <View style={styles.profileInfo}>
                    <TextInput
                        style={styles.input}
                        value={user.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        editable={editing}
                        placeholder="Name"
                    />
                    <TextInput
                        style={styles.input}
                        value={user.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        editable={editing}
                        placeholder="Email"
                    />
                     <TextInput
                       style={styles.input}
                       value={user.dateOfBirth}
                       onChangeText={(value) => handleInputChange('dateOfBirth', value)}
                      editable={editing}
                      placeholder="Date of Birth"
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
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backgroundImage: {
        height: '110%',
        width: '100%',
    },
    title: {
        marginTop: '70%',
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 10,
        marginHorizontal: '10%',
        color: '#3b3b66',
    },
    profileInfo: {
        width: '80%',
        marginBottom: 15,
        marginHorizontal: '10%',
    },
    input: {
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#8c8c9f',
        borderRadius: 5,
        borderLeftWidth: 1,
        borderColor: '#3b3b66',
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
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
});

export default AdminProfile;
