import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadGrades = ({ onFileUploaded }) => {
  const [file, setFile] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFilePickAndUpload = async () => {
    try {
      // Pick a PDF file
      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      console.log('Selected document:', doc[0]);

      // Fix the URI if necessary
      const fileUri = Platform.OS === 'android' ? doc[0].uri : doc[0].uri.replace('file://', '');
      console.log('File URI:', fileUri);

      setFile([doc[0]]); // Wrap the document in an array

      // Prepare FormData
      const formData = new FormData();
      formData.append('file', {
        uri: doc[0].uri,
        type: doc[0].type,
        name: doc[0].name,
      });

      console.log('FormData:', formData);

      // Get JWT token from AsyncStorage
      const token = await AsyncStorage.getItem('jwtToken');
      setUploading(true); // Set uploading state to true

      // Upload file
      const response = await axios.post('http://192.168.0.106:8000/api/upload/grades', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Server response:', response);
      console.log('Server response data:', response.data);

      // Handle server response
      if (response.status === 200 && response.data.message === 'File uploaded successfully') {
        Alert.alert('Success', 'File uploaded successfully');
        if (onFileUploaded) {
          onFileUploaded(doc[0].name); // Call callback to update the file name in the parent component
        }
        setFile([]); // Clear file after upload
      } else {
        Alert.alert('Error', response.data.message || 'Upload failed, please try again');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Canceled');
      } else {
        console.error('Upload error:', err);
        Alert.alert('Error', 'Failed to pick or upload the file');
      }
    } finally {
      setUploading(false); // Set uploading state to false
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./download.png')} style={{ height: '15%', width: '30%', marginTop: '10%' }} />
      <View style={styles.uploadContainer}>
        <Text style={styles.text}>Upload Grades Pdf</Text>
        <View style={styles.horizontal} />
        <TouchableOpacity
          style={styles.button}
          onPress={handleFilePickAndUpload}
          disabled={file.length > 0 || uploading}
        >
          <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Select and Upload'}</Text>
        </TouchableOpacity>
        {file.length > 0 && <Text>Ready to Upload: {file[0].name}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#3b3b66',
  },
  uploadContainer: {
    marginTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3b3b66',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '50%',
    marginHorizontal: '25%',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  horizontal: {
    marginTop: '5%',
    backgroundColor: 'black',
    width: 250,
    height: 1,
    marginBottom: '5%',
    alignSelf: 'center',
  },
});

export default UploadGrades;
