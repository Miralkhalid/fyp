import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chatbox = () => {
  const [admin, setAdmin] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  useEffect(() => {
    fetchAdminDetails();
    GetInitialMessage();
  }, []);

  const fetchAdminDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get('http://192.168.0.106:8000/api/get/admin/detail', config);

      if (response.data.status === 'success') {
        setAdmin(response.data.data); // Store admin details
      } else {
        console.error('Failed to fetch admin details:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching admin details:', error);
    }
  };
const GetInitialMessage = async () => {
  try {
    const token = await AsyncStorage.getItem('jwtToken');
    const studentId = await AsyncStorage.getItem('studentId');

    if (!token || !studentId) {
      console.error('Missing token or student ID');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
console.log('STDID:', studentId);
console.log('TOKEN:', token);
    const response = await axios.get(`http://192.168.166.191:8000/api/get/messages/${studentId}`, config);

//    console.log('Fetched messages:', response);

    if (response.data) {
    console.log('msg', response.data);

      setMessages(response.data.data); // Assuming `setMessages` is the function to set the messages state
    } else {
      console.error('Failed to fetch messages:', response.data.message);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

  const sendMessage = async () => {
    if (inputText.trim() === '' || !admin) return;

    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        console.error('No JWT token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const messagePayload = {
        receiver_id: admin.id, // Admin ID as receiver_id
        message: inputText, // Message text
      };

      // Send the message to the server
      const response = await axios.post('http://192.168.166.191:8000/api/send/messages', messagePayload, config);

      if (response.data.status === 'success') {
        const newMessage = {
          id: response.data.data.id, // Use the ID from the response
          text: inputText,
          timestamp: new Date(response.data.data.created_at).toLocaleTimeString(),
          sender: 'admin', // Indicate that this is an admin message
        };

        setMessages([...messages, newMessage]);
        setInputText('');
        setMessageIdCounter(messageIdCounter + 1);
      } else {
        console.error('Failed to send message:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatContainer}>
        {admin ? (
          <>
            <FlatList
                        data={messages}
                        renderItem={({ item }) => (
                          <View style={[styles.message, item.sender === 'admin' ? styles.adminMessage : styles.otherMessage]}>
                            <Text style={styles.messageText}>{item.message}dbd</Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                          </View>
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.messagesContainer}
                      />
     {/*       <FlatList
              data={messages}
              renderItem={({ item }) => (
                <View style={[styles.message, item.sender === 'admin' ? styles.adminMessage : styles.otherMessage]}>
                  <Text style={styles.messageText}>{item.text}</Text>
                  <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.messagesContainer}
            />
*/}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message"
              />
              <IconButton icon="send" size={30} onPress={sendMessage} style={styles.icon} />
            </View>
          </>
        ) : (
          <Text style={styles.loadingText}>Loading admin details...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  messagesContainer: {
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  messageText: {
    color: '#000',
  },
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  adminMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#f8d7da',
    alignSelf: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  icon: {
    marginLeft: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default Chatbox;
