import React, {useState} from 'react'
import {ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'

  const Boxes = ({navigation}) => {
    const [loading, setLoading] = useState(false);

//    const handleNavigation = (scree) => {
//      setLoading(true);
//      setTimeout(() => {
//        setLoading(false);
//        navigation.navigate(screen);
//      }, 1000); // Simulate a delay for the loader, replace with actual navigation delay
//    };

    return (
     <View style={styles.container}>
        <ImageBackground source={require('./design.png')} resizeMode='cover' style={{height:'100%', width:'100%'}}>
        <View style={styles.box}>
           <View style={styles.inner}>
              <TouchableOpacity style={styles.touch} onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.btn}>Course Registration</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.touch} onPress={() => navigation.navigate('RegisteredCourses')}>
                <Text style={styles.btn} >Registered Courses</Text>
              </TouchableOpacity>
          </View>
        </View>

    <Modal
       animationType="fade"
       transparent={true}
       visible={loading}
       onRequestClose={() => {
         setLoading(!loading);
       }}
     >
       <View style={styles.modalBackground}>
   <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#3b3b66" />
            <Text style={styles.loadingText}>Loading...</Text>
         </View>
       </View>
             </Modal>
        </ImageBackground>
     </View>
    )
  }


const CourseRegistration= ({navigation}) => {
  return (
    <SafeAreaView>
        <Boxes navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
      container:{
       // backgroundColor:'red',
        height:'100%',
        width:'100%',
        padding:5,
      },
      box:{
        flex:1,
       // backgroundColor:'yellow',
        height:'100%',
        flexDirection:'column',
        flexWrap:'wrap',
        padding:5,
      },
      inner:{
       // backgroundColor:'pink',
        height:'100%',
        width:'100%',
        justifyContent:'center',
        padding:10,
        marginTop:20,
      },
      btn:{
        fontSize:15,
        //marginLeft:'10%',
        backgroundColor:'#3b3b66',
        marginTop:10,
        width:'105%',
        padding:50,
        textAlign:'center',
        color:'white',
        borderRadius:10,
      },
      touch:{
        marginHorizontal:'25%',
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
        // backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        marginTop: 10,
        color: '#cdcddb',
        fontWeight: 'bold',
      },
  
})

export default CourseRegistration