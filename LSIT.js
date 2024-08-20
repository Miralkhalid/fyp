import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const LSIT = ({navigation}) => {
  return (
    <View>
    <ImageBackground source={require('./LSIT.png')} resizeMode='cover' style={{height:'100%', width:'100%'}}>
      <View style={styles.portion}>
        <Text style={styles.heading}>Select your category</Text>
        <View style={styles.horizontal}></View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.touch}>
            <Text style={styles.touchtext}>Student</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Admin')} style={styles.touch}>
            <Text style={styles.touchtext}>Admin</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Staff')} style={styles.touch}>
            <Text style={styles.touchtext}>Staff</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    portion:{
        marginTop:'80%',
    },
    heading:{
        textAlign:'center',
        color:'#3b3b66',
        fontWeight:'500',
        fontSize:16,
        marginBottom:10,
        // textShadowColor: 'rgba(0, 0, 0, 0.20)',
        // textShadowOffset: { width: 2, height: 2 }, 
        // textShadowRadius: 4,
    },
    touch:{
        alignSelf:'center',
        backgroundColor:'#3b3b66',
        width:'35%',
        marginTop:6,
        borderRadius:10,
    },
    touchtext:{
        color:'white',
        textAlign:'center',
        padding:'20%',
        justifyContent:'center',
        fontWeight:'bold',
    },
    horizontal:{
      marginTop: 15,
      backgroundColor: 'black',
      alignSelf:'center',
      width: 250,
      height: 1,
      marginBottom:'5%',
    }
})

export default LSIT