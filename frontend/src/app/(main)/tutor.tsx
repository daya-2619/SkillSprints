import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';

export default function TutorScreen() {
  const [messages, setMessages] = useState<{id: string, text: string, isBot: boolean}[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMessage = { id: Date.now().toString(), text: input, isBot: false };
    const botMessageId = (Date.now() + 1).toString();
    const botInitialMessage = { id: botMessageId, text: '', isBot: true };
    
    setMessages(prev => [...prev, userMessage, botInitialMessage]);
    setInput('');

    // Fetch streaming SSE
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/api/v1/tutor/ask', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onprogress = () => {
      const responseText = xhr.responseText;
      // Parse SSE lines
      const lines = responseText.split('\n');
      let streamedText = '';
      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          streamedText += line.replace('data: ', '');
        }
      }
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId ? { ...msg, text: streamedText } : msg
        )
      );
    };

    xhr.send(JSON.stringify({ course_id: 1, query: input }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.isBot ? styles.botBubble : styles.userBubble]}>
            <Text style={styles.text}>{item.text || '...'}</Text>
          </View>
        )}
      />
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          value={input} 
          onChangeText={setInput} 
          placeholder="Ask your AI tutor..." 
          placeholderTextColor="#888"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  bubble: { padding: 15, margin: 10, borderRadius: 10, maxWidth: '80%' },
  userBubble: { backgroundColor: '#0A84FF', alignSelf: 'flex-end' },
  botBubble: { backgroundColor: '#2C2C2E', alignSelf: 'flex-start' },
  text: { color: '#FFF', fontSize: 16 },
  inputRow: { flexDirection: 'row', padding: 10, backgroundColor: '#1C1C1E', alignItems: 'center' },
  input: { flex: 1, color: '#FFF', backgroundColor: '#3A3A3C', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10 },
});
