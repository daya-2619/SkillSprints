import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveSessionScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoText}>Live Video Stream Placeholder</Text>
      </View>
      <View style={styles.chatPanel}>
        <Text style={styles.chatTitle}>Live Chat</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  videoPlaceholder: { flex: 2, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  videoText: { color: '#FFF' },
  chatPanel: { flex: 1, backgroundColor: '#1E1E1E', padding: 10 },
  chatTitle: { color: '#FFF', fontWeight: 'bold' },
});
