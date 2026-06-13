import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

interface FeedItemProps {
  item: { id: string; title: string; video_url: string };
  index: number;
  scrollY: Animated.SharedValue<number>;
}

export default function FeedItem({ item, index, scrollY }: FeedItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [(index - 1) * height, index * height, (index + 1) * height],
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );
    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Video Player Placeholder */}
      <View style={styles.videoPlaceholder}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
      {/* Interaction Sidebar */}
      <View style={styles.sidebar}>
        <View style={styles.iconPlaceholder} />
        <View style={styles.iconPlaceholder} />
        <View style={styles.iconPlaceholder} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { height, width, backgroundColor: '#000', justifyContent: 'center' },
  videoPlaceholder: { flex: 1, justifyContent: 'flex-end', padding: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  sidebar: { position: 'absolute', right: 10, bottom: 50, alignItems: 'center' },
  iconPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 20 },
});
