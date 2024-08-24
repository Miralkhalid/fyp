import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminChatbox = ({route}) => {
    const { id } = route.params;
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

console.log('ab', id);

    const API_BASE_URL = 'http://192.168.0.106:8000/api'; // Replace with your backend API base URL

    useEffect(() => {
        fetchMessages(id);
    }, [id]);

const fetchMessages = async (id) => {
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
console.log('STDID:', id);
console.log('TOKEN:', token);
    const response = await axios.get(`http://192.168.0.106:8000/api/get/messages/${id}`, config);
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
    try {
        const token = await AsyncStorage.getItem('jwtToken');

        // Ensure the token is available
        if (!token) {
            console.error('Missing token');
            return;
        }

        // Send the message to the API
        const response = await axios.post(`${API_BASE_URL}/send/messages`, {
                receiver_id: id,
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
console.log('receive', response);
        // Check for successful response
        if (response.data.status === 'success') {
            // Clear the input field
            setMessage('');

            // Extract the new message data from the response
            const newMessage = response.data.data;

            // Optionally update local state with the new message
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
            console.error('Failed to send message:', response.data.message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
};


    const renderMessageItem = ({ item }) => {
//        if (id === null) {
//            return null; // Or a loading indicator
//        }

        const isSentByCurrentUser = item.sender_id === id;

        return (
            <View
                style={[
                    styles.messageContainer,
                    !isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage,
                ]}
            >
                <Text style={[
                                  styles.messageText,
                                  !isSentByCurrentUser ? styles.sentText : styles.receivedText,
                              ]}>{item.message}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id.toString()}
                inverted
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                />
                <Button title="Send" onPress={sendMessage} />
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
        padding: 10,
        flexDirection: 'column-reverse',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    input: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginRight: 10,
        color:'black',
    },
    messageContainer: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    sentMessage: {
        backgroundColor: '#297373',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#e6e6e6',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    sentText: {
            color: 'white', // Color for sent messages
        },
        receivedText: {
            color: '#297373', // Color for received messages
        },
});

export default AdminChatbox;
