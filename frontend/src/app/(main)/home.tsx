import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import FeedItem from '../../components/FeedItem';

const { height } = Dimensions.get('window');

// Sample data for fallback
const mockFeed = [
  { id: '1', title: 'Intro to Python', video_url: 'https://example.com/vid1.mp4' },
  { id: '2', title: 'Understanding React Native', video_url: 'https://example.com/vid2.mp4' },
  { id: '3', title: 'Machine Learning Basics', video_url: 'https://example.com/vid3.mp4' },
];

export default function HomeScreen() {
  const [feed, setFeed] = useState(mockFeed);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        snapToInterval={height}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <FeedItem item={item} index={index} scrollY={scrollY} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }
});
