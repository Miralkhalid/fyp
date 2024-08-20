import React from 'react'
import { ImageBackground,  SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Header = () => {
    return (
      <View style={styles.header}>
        <ImageBackground source={require('./campus.png')} resizeMode='cover' style={{height:"100%", width:"100%"}}>
          </ImageBackground>
      </View>
    )
  }

  const Boxes = ({navigation}) => {
    return (
      <View style={styles.Boxcontainer}>
        <Text style={styles.caption}>Welcome to the LSIT!</Text>
        <View style={styles.box}>
          <View style={styles.inner}>
            <TouchableOpacity onPress={() => navigation.navigate('AddLibrary')}>
                <Text style={styles.button}>classes</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('StaffCourse')}>
                <Text style={styles.button}>Courses</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('JobsListing')}>
                <Text style={styles.button}>Jobs</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('StaffProfile')}>
                <Text style={styles.button}>Profile</Text>
            </TouchableOpacity>
          </View>  
        </View>   
      </View>
      
    )
  }

const StaffBoard = ({navigation}) => {
  return (
    <SafeAreaView>
        <Header />
        <Boxes  navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    header:{
        height:'35%',
        justifyContent:'center',
    },
    Boxcontainer:{
      height:'50%',
      width:'100%',
      flexDirection:'row',
      flexWrap:'wrap',
      padding:15,
    },
    box:{
       //backgroundColor:'yellow',
        height:'50%',
        width:'50%',
        padding:5,
        marginTop:2,
    },
    inner:{
        flex:1,
        backgroundColor:'#3b3b66',
        borderRadius:10,
    },
    caption:{
        color:'#3b3b66',
        fontSize:16,
        marginLeft:'25%',
        padding:5,
        fontWeight:'500',
    },
    button:{
        color:'white',
        fontSize:14,
        textAlign:'center',
        marginTop:60, 
        height:'60%',
        fontWeight:'500',
    }
})

export default StaffBoard