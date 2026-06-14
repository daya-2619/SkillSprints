import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, shadows, typography } from '../theme';

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85}>
      <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.title}>{video.title}</Text>
        <Text style={styles.subtitle}>Tap to play lesson</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glass,
    ...shadows.soft,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#333',
  },
  info: {
    padding: 16,
  },
  title: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
