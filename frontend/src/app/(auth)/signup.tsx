import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // API call to /api/v1/auth
    console.log('Signup', email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 28, color: '#FFF', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#333', color: '#FFF', padding: 15, borderRadius: 8, marginBottom: 15 },
});
