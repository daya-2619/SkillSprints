# Component Breakdown - SkillSprint

## Global Components
- `Header`: Standard top app bar with safe area view.
- `TabBar`: Custom animated bottom tab bar using Reanimated.
- `Button`: Reusable primary/secondary buttons with haptic feedback.

## Feed Components
- `FeedItem`: Individual vertical scroll item housing the video.
- `VideoPlayer`: Wrapper around `expo-av` or `react-native-video` with custom playback controls.
- `InteractionSidebar`: Vertical stack of action icons.

## Quiz Components
- `QuizCard`: Holds the question text and image if any.
- `OptionButton`: Selectable button that animates on correct/incorrect selection.
- `TimerBar`: Horizontal progress bar syncing with remaining time.

## WebView Components
- `LabWebView`: Wrapper around `react-native-webview` specifically configured for external coding environments, injecting auth tokens via headers.
