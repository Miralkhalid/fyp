import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications</Text>
      {/* Add your notification content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Notification;
