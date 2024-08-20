import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; 

const Header = () => {
  return (
    <View style={styles.header}>    
       <Image source={require('./campus.png')} resizeMode='cover' style={{ height: "100%", width: "100%" }}>
       </Image> 
    </View>
  );
};

const Boxes = ({ navigation }) => {
  return (
    <View style={styles.Boxcontainer}>
      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={styles.button}>Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('AcademicService')}>
            <Text style={styles.button}>AcademicService</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('Studentservices')}>
            <Text style={styles.button}>Student Services</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('StudentInfo')}>
            <Text style={styles.button}>Student Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('StaffInfo')}>
            <Text style={styles.button}>Staff Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.box}>
        <View style={styles.inner}>
          <TouchableOpacity onPress={() => navigation.navigate('AdminProfile')}>
            <Text style={styles.button}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Board = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Boxes navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '35%',
    justifyContent: 'center',
  },
  Boxcontainer: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  box: {
    height: '40%',
    width: '50%',
    padding: 5,
  },
  inner: {
    flex: 1,
    backgroundColor: '#3b3b66',
    borderRadius: 10,
  },
  button: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 55,
    height: '60%',
  },
  btn: {
    marginTop: 10,
    backgroundColor: '#3b3b66',
  }
});

export default Board;
