import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface LabWebViewProps {
  url: string;
  token: string;
}

export default function LabWebView({ url, token }: LabWebViewProps) {
  const webViewRef = useRef<WebView>(null);

  const handleMessage = (event: any) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'LAB_COMPLETED') {
      console.log('Lab completed with score:', data.score);
      // Trigger gamification update
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{
          uri: url,
          headers: { Authorization: `Bearer ${token}` }
        }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
