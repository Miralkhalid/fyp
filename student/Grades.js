import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const Grades = () => {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await axios.get(`${ip}/api/fetch-grade/student/${id}`, {
          responseType: 'blob', // Important
        });
        const pdfBlob = response.data;
        const reader = new FileReader();

        reader.onloadend = () => {
          setPdfData(reader.result);
          setLoading(false);
        };

        reader.readAsDataURL(pdfBlob); // Convert blob to base64
      } catch (error) {
        console.error('Failed to fetch PDF:', error);
        setLoading(false);
      }
    };

    fetchPdf();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <WebView
          source={{ uri: pdfData }}
          style={{ flex: 1 }}
          originWhitelist={['*']}
        />
      )}
    </View>
  );
};

export default Grades;
