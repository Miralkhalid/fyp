import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ImageBackground, ScrollView } from 'react-native';
import axios from 'axios';

const Courses = ({navigation}) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [semester, setSemester] = useState('');
    const [credit_hour, setCreditHour] = useState('');

    const handleCreateCourse = async () => {
        try {
            console.log({
                code,
                name,
                department,
                semester,
                credit_hour,
                
            });
            const response = await axios.post('http://192.168.0.106:8000/api/course/create', {
                code: code,
                name:  name,
                department: department,
                semester:semester,
                credit_hour:credit_hour,
                created_by: 1,
            });
        
            Alert.alert('Success', 'Course created successfully');
            console.log(response.data);
            
        } catch (error) {
            console.error('Error creating course:', error);
            Alert.alert('Error', 'Failed to create course');
        }
    };

    return (
     <View style={styles.container}>
        <ScrollView>
       <ImageBackground source={require('./lsitlogobg.png')} style={{height:'120%', width:'100%'}}>
      
        <View style={styles.form}>
        <Text style={styles.caption}>Enter Course Details !</Text>
            <TextInput
                style={styles.input}
                placeholder="Course code"
                placeholderTextColor={'#cdcddb'}
                value={code}
                onChangeText={setCode}
            />
            <TextInput
                style={styles.input}
                placeholder="Course name"
                placeholderTextColor={'#cdcddb'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Department"
                placeholderTextColor={'#cdcddb'}
                value={department}
                onChangeText={setDepartment}
            />
            <TextInput
                style={styles.input}
                placeholder="Semester"
                placeholderTextColor={'#cdcddb'}
                value={semester}
                onChangeText={setSemester}
            />
            <TextInput
                style={styles.input}
                placeholder="Credit hour"
                placeholderTextColor={'#cdcddb'}
                value={credit_hour}
                onChangeText={setCreditHour}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreateCourse}>
                <Text style={styles.buttonText}>Create Course</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('CourseList')}>
                <Text style={styles.buttonText}>Course List</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
        </ScrollView>
        </View> 
    );
};

const styles = StyleSheet.create({
   container:{
     backgroundColor:'white',
    height:'100%',
   },
    form: {   
        marginTop:'50%', 
        // padding: 10,
        backgroundColor: '#fff',
       // justifyContent:'center',
        alignItems:'center',
    },
    input: {
        color:'#3b3b66',
        borderColor: '#3b3b66',
        borderLeftWidth:1,
        borderRightWidth:1,
        borderBottomWidth:2,
        marginBottom: 10,
        width:'70%',
        borderRadius: 10,
        paddingHorizontal: 10,
        color:'#3b3b66',
        fontWeight:'400',
    },
    button: {
        backgroundColor: '#3b3b66',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 15,
        width:'70%',
    },
    button2: {
        backgroundColor: '#3b3b66',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 5,
        width:'70%',
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        // fontWeight: '500',
        fontSize: 14,
    },
    caption:{
        color:'#3b3b66',
        marginBottom:15,
        fontSize:14,
        fontWeight:'500',
        textAlign:'center',
    }
});

export default Courses;
