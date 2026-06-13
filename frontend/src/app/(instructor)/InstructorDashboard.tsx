import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InstructorDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Instructor Dashboard</Text>
      <Text style={styles.text}>Manage your courses, view analytics, and start live sessions.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 24, color: '#FFF', marginBottom: 15 },
  text: { color: '#CCC' },
});
