import React, { useState, useRef } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Navbar } from '../components/Navbar';
import Footer from '../components/Footer';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const sendButtonRef = useRef(null); // Create a ref for the Send button

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    // Add the user's message to the chat
    const updatedMessages = [...messages, { text: newMessage, isUser: true }];
    setMessages(updatedMessages);

    // Simulate a bot response (you can replace this with actual bot logic)
    const botResponse = getBotResponse(newMessage);
    const updatedMessagesWithBot = [...updatedMessages, { text: botResponse, isUser: false }];
    setMessages(updatedMessagesWithBot);

    // Clear the input field
    setNewMessage('');

    // Focus the Send button again after sending a message
    if (sendButtonRef.current) {
      sendButtonRef.current.focus();
    }
  };

  // Sample bot logic (you can customize this)
  const getBotResponse = (userMessage) => {
    if (userMessage.toLowerCase().includes('book a room')||
       userMessage.toLowerCase().includes('book') ||
       userMessage.toLowerCase().includes('room') ) {
      return 'You can book a room by visiting our website and selecting your desired dates and room type.';
    } else if (userMessage.toLowerCase().includes('check-in')) {
      return 'Our check-in time is at 12:00 AM.';
    } else if (userMessage.toLowerCase().includes('check-out')) {
      return 'Our check-out time is at 12:00 AM.';
    } else if (
      userMessage.toLowerCase().includes('menu') ||
      userMessage.toLowerCase().includes('food') ||
      userMessage.toLowerCase().includes('restaurant') ||
      userMessage.toLowerCase().includes('book a table') ||
      userMessage.toLowerCase().includes('reserve')
    ) {
      return 'You can browse through our Restaurant Menu from our website and reserve a table now to dine-in with us';
    } else {
      return "I'm sorry, I didn't understand your question. Please ask something else.You can browse through our Restaurant Menu from our website and reserve a table now to dine-in with us You can book a room by visiting our website and selecting your desired dates and room type. You can also contact us on info@crownhotels.com ";
    }
  };

  const faqs = [
    {
      question: 'How can I book a room?',
      answer: 'You can book a room by visiting our website and selecting your desired dates and room type.',
    },
    {
      question: 'What are the check-in and check-out times?',
      answer: 'Check-in time is at 12:00 AM, and check-out time is at 12:00 AM (12 to 12).',
    },
    {
      question: 'Do you have free Wi-Fi?',
      answer: 'Yes, we provide free Wi-Fi for all our guests.',
    },
    {
        question: 'What types of cuisine do you offer at your restaurant?',
        answer: 'Our restaurant offers a diverse menu with a wide range of cuisines, including local specialties and international dishes.',
      },
      {
        question: 'Can I order food for room service?',
        answer: 'Yes, you can order food for room service from our restaurant. Please check the room service menu for options.',
      },
      {
        question: 'Do you provide vegetarian or vegan meal options?',
        answer: 'Yes, we offer vegetarian and vegan meal options at our restaurant. Please ask your server for assistance.',
      }
  ];

  return (
  <>
    <div>
      <Navbar />
      <Container maxWidth="lg">

        {/* Frequently Asked Questions */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <List>
            {faqs.map((faq, index) => (
              <div key={index}>
                <ListItem>
                  <ListItemText primary={faq.question} secondary={faq.answer} />
                </ListItem>
                {index !== faqs.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
        {/* Chatbot Interface */}
        <Paper elevation={3}  style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Chat with Us
          </Typography>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                style={{ textAlign: message.isUser ? 'right' : 'left', marginBottom: '10px' }}
              >
                <ListItemText
                  primary={message.text}
                  style={{
                    borderRadius: '10px',
                    padding: '10px',
                    backgroundColor: message.isUser ? '#3f51b5' : '#f5f5f5',
                    color: message.isUser ? 'white' : 'black',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            label="Type your message"
            fullWidth
            variant="outlined"
            margin="normal"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage(); // Call handleSendMessage when Enter key is pressed
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSendMessage}
            ref={sendButtonRef} // Assign the ref to the Send button
          >
            Send
          </Button>
        </Paper>

        

        {/* Contact Us */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', marginBottom: '20px' }}>
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" gutterBottom>
            For inquiries, you can reach us at:
          </Typography>
          <Typography variant="body1" gutterBottom>
            Phone: 011-123-4567
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: info@crownhotels.com
          </Typography>
          <Typography variant="body1" gutterBottom>
            Address: No.123, Kattubedda Road, Moratuwa
          </Typography>
        </Paper>
      </Container>
    </div>
    <Footer/>
  </>
  );
};

export default Chat;
