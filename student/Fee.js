import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StudentPDFViewer from './StudentPDFViewer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Fee = () => {
  const [pdfUri, setPdfUri] = useState(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
//        const fileName = await AsyncStorage.getItem('file_name'); // Retrieve the stored PDF URL
       const fileName = ('1720206474_fee details.pdf');
        if (fileName) {
          setPdfUri(fileName); // Set the PDF URL in state
        }
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      }
    };

    fetchPdfUrl();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fee Structure</Text>
      {pdfUri ? (
        <StudentPDFViewer fileName={pdfUri} /> // Pass the complete PDF URL to StudentPDFViewer
      ) : (
        <Text>Loading PDF...</Text> // Display a loading message while the PDF URL is being fetched
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Fee;