import React, { useState } from 'react';
import { Alert, View, TextInput, ImageBackground, ScrollView, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RadioButton} from 'react-native-paper';
//import { ip } from './global';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // Start loading
    setModalVisible(true); // Show modal
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
      console.log(email, password );
      const response = await axios.post('http://192.168.0.106:8000/api/login',{
//       const response = await axios.post(`${ip}/api/login`,{
        email: email,
        password: password,
        role: 'student'
      });
      console.log('Response:', response.data);
      if (response.data && response.data.status === 'success' && response.data.data.access_token) {
        await AsyncStorage.setItem('jwtToken', response.data.data.access_token);
        console.log(response.data.data["user-detail"].id);

        if(response.data.data['user-detail'].role === 'student')
        {
          const studentId = response.data.data['user-detail'].id;
          const studentEmail = response.data.data['user-detail'].email;
          await AsyncStorage.setItem('studentId', JSON.stringify(studentId));
          setSuccessModalVisible(true); // Show success modal
          setTimeout(() => {
            setSuccessModalVisible(false); // Hide success modal after 2 seconds
            setEmail(''); // Clear email field
            setPassword(''); // Clear password field
            setChecked('');
            if (checked) {
                          navigation.navigate('AlumniDB'); // Navigate to AlumniDB screen if checkbox is checked
                        }
            else {
                          navigation.navigate('Dashboard');
                        }
            // navigation.navigate('Dashboard');
                 }, 2000);
        }
       
      } else {
        Alert.alert('Login failed');
      }
    } catch (error) {
      Alert.alert('Login failed', error.message);
    } finally {
      setLoading(false);
      setModalVisible(false); // Hide modal
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View>
      <ScrollView>
        <ImageBackground source={require('./design.png')} style={{height:'100%'}}>
          <View style={styles.form}>
            <Text style={styles.caption}>Welcome To LSIT!</Text>
            <Text style={styles.text}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <Text style={styles.text}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>{showPassword ? 'Hide' : 'Show Password'}</Text>
            </TouchableOpacity>
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxtext}>Login as Alumni</Text>
               <RadioButton
               value="first"
               status={ checked === 'first' ? 'checked' : 'unchecked' }
               onPress={() => setChecked('first')}
             />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#3b3b66" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => {
          setSuccessModalVisible(!successModalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.successModalContainer}>
            <Text style={styles.successText}>Login successful!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginVertical: '60%',
    marginHorizontal: '10%',
  },
  caption: {
    color: '#3b3b66',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: '10%',
  },
  text: {
    color: '#3b3b66',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: "#3b3b66",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color:'#3b3b66',
  },
  button: {
    backgroundColor: "#3b3b66",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: '50%',
    marginHorizontal: '25%',
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButtonText: {
    color: '#8c8c9f',
    fontWeight: '600',
  },
  checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      checkboxLabel: {
        marginLeft: 8,
        fontSize: 18,
      },
      statusText: {
        marginTop: 20,
        fontSize: 18,
      },
      checkboxtext: {
        color: '#3b3b66',
        fontWeight: '500',
      },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 150,
    height: 150,
    // backgroundColor: '#cdcddb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#cdcddb',
    fontWeight: 'bold',
  },
  successModalContainer: {
    width: 200,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#3b3b66',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Login;