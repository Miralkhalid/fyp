import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.0.106:8000/api';

const AdminChatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  useEffect(() => {
    // Fetch initial messages when the component mounts
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.get(`{$API_URL}/api/chat/messages/${receiver_id}`, config);
      setMessages(response.data.messages); // Adjust based on your API response
      setMessageIdCounter(response.data.messages.length); // Start ID counter from existing messages length
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || receiverId === null) return;
  
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
        receiver_id: receiverId, // Receiver ID from the selected student
        message: inputText,
      };
  
      // Send the message to the server
      await axios.post(`{API_URL}/api/chat/send`, messagePayload, config);
  
      const newMessage = {
        id: messageIdCounter,
        text: inputText,
        timestamp: new Date().toLocaleTimeString(),
        sender: 'user',
      };
  
      setMessages([...messages, newMessage]);
      setInputText('');
      setMessageIdCounter(messageIdCounter + 1);
  
      // Simulate receiving a message
      setTimeout(() => {
        receiveMessage("I'm a bot response!");
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
  };
  


  const receiveMessage = (text) => {
    const newMessage = {
      id: messageIdCounter,
      text,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'bot'
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageIdCounter(messageIdCounter + 1);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.message, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <IconButton icon="send" size={30} onPress={sendMessage} style={styles.icon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesContainer: {
    padding: 10,
    backgroundColor: '#3b3b66',
    paddingBottom: 80, // Ensure space for input container
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#3b3b66',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 10,
    color: '#3b3b66',
    fontWeight: '500',
  },
});

export default AdminChatbox;
