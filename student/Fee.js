import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StudentPDFViewer from './StudentPDFViewer';

const Fee = () => {
  const pdfUri = '1721915941_fee_details.pdf'; // Replace with the actual file name

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fee Structure</Text>
      <StudentPDFViewer fileName={pdfUri} />
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
