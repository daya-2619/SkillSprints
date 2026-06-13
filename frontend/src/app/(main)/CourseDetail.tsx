import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CourseDetailScreen() {
  const course = {
    title: 'Advanced Machine Learning',
    description: 'Deep dive into neural networks and LLMs.',
    modules: [
      { id: '1', title: 'Module 1: Deep Learning', lessons: [{ id: '1a', title: 'What is a perceptron?' }] },
      { id: '2', title: 'Module 2: Transformers', lessons: [{ id: '2a', title: 'Attention is all you need' }] }
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.description}>{course.description}</Text>
      
      <View style={styles.modulesContainer}>
        {course.modules.map(mod => (
          <View key={mod.id} style={styles.moduleCard}>
            <Text style={styles.moduleTitle}>{mod.title}</Text>
            {mod.lessons.map(les => (
              <TouchableOpacity key={les.id} style={styles.lessonItem}>
                <Text style={styles.lessonText}>▶ {les.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { fontSize: 28, color: '#FFF', fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#CCC', fontSize: 16, marginBottom: 30 },
  modulesContainer: { gap: 15 },
  moduleCard: { backgroundColor: '#1E1E1E', padding: 15, borderRadius: 10 },
  moduleTitle: { color: '#0A84FF', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  lessonItem: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#333' },
  lessonText: { color: '#FFF' },
});
