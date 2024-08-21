import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const StudentPDFViewer = ({ fileName }) => {
  const [pdfUri, setPdfUri] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPdfUri = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await axios.get('http://192.168.0.106:8000/api/upload/fetch-fees/grades', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            fileName: fileName, // Pass fileName as query parameter
          },
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.data && response.data.data.data) {
          setPdfUri(response.data.data.data);
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
        onLoad={() => console.log('PDF loaded successfully')}
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
