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
        <Text style={styles.caption}>Education is not the filling of a pail, but the lighting of a fire.✨</Text>
        <View style={styles.box}>
          <View style={styles.inner}>
            <TouchableOpacity onPress={() => navigation.navigate('AddLibrary')}>
                <Text style={styles.button}>Library</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('UploadJob')}>
                <Text style={styles.button}>Career Services</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('CreateIdCard')}>
                <Text style={styles.button}>ID Card</Text>
            </TouchableOpacity>
          </View>  
        </View>

        <View style={styles.box}>
          <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('StudentList'
          )}>
                <Text style={styles.button}>Chatbox</Text>
            </TouchableOpacity>
          </View>  
        </View>
      
      </View>
      
    )
  }

const Studentservices = ({navigation}) => {
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
        textAlign:'center',
        marginLeft:30,
        padding:5,
        fontVariant:'700',
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

export default Studentservices