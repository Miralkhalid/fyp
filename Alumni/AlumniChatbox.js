import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';

const AlumniChatbox = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [messageIdCounter, setMessageIdCounter] = useState(0);

  useEffect(() => {
    // Send initial message when the component mounts
    const initialMessage = {
      id: messageIdCounter,
      text: 'Hello, how can I help you?',
      timestamp: new Date().toLocaleTimeString(),
      sender: 'bot', // 'user' or 'bot'
    };
    setMessages([initialMessage]);
    setMessageIdCounter(messageIdCounter + 1);
  }, []);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: messageIdCounter,
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user', // 'user' or 'bot'
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setMessageIdCounter(messageIdCounter + 1);

    // Simulate receiving a message
    setTimeout(() => {
      receiveMessage("I'm a bot response!");
    }, 1000);
  };

  const receiveMessage = (text) => {
    const newMessage = {
      id: messageIdCounter,
      text,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'bot', // 'user' or 'bot'
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
    padding: '100%',
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

export default AlumniChatbox;
