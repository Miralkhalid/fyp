import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
//import Pdf from 'react-native-pdf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentPDFViewer = ({ fileName }) => {
  const [pdfUri, setPdfUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfUri = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');

        if (!token) {
          throw new Error('Token not found');
        }

        const response = await axios.get('http://192.168.0.106:8000/api/upload/fetch-fees/fees', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        console.log('API Response:', response.data);
// console.log('resp', typeof JSON.parse(response.data.slice(4)));

        if (response.data && response.data) {
//        const url = JSON.parse(response.data.slice(4)).url;
//        console.log('url', url);
          setPdfUri(response.data.url); // Assuming the API returns fileUri
        } else {
          throw new Error('PDF URI not found in response');
        }
      } catch (error) {
        console.error('Error fetching PDF URI:', error.response ? error.response.data : error.message);
        setError('Failed to fetch PDF URI');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfUri();
  }, [fileName]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b3b66" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: pdfUri }}
        style={styles.pdf}
        onLoad={() => Alert.alert('PDF is  downloading')}
        onError={(error) => {
          console.error('Error loading PDF:', error.nativeEvent.description || error.message);
          Alert.alert('Error', 'Failed to load PDF');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pdf: {
    flex: 1,
  },
});

export default StudentPDFViewer;