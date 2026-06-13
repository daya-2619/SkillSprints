// frontend/src/screens/HomeFeed.tsx

import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { VideoCard } from "../components/VideoCard";

// Placeholder data
const videos = [
  { id: "1", title: "Intro to AI", thumbnail: "https://via.placeholder.com/150" },
  { id: "2", title: "Python Basics", thumbnail: "https://via.placeholder.com/150" },
];

export default function HomeFeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Feed</Text>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoCard video={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f8", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", color: "#2c3e50", marginBottom: 12 },
  list: { paddingBottom: 80 },
});
