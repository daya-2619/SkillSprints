# WebView Architecture - SkillSprint

For integrating external labs (e.g., Jupyter Notebooks, CodeSandbox) securely.

## Components
- **`LabWebView`**: Renders `react-native-webview`.

## Security & Auth
- **Headers**: Injects `Authorization: Bearer <token>` upon initial load.
- **CORS/CSP**: The target lab environment must explicitly whitelist the SkillSprint app domains.

## PostMessage Bridge
Communication between React Native and the embedded web page:
- **From Web to Native**: The lab sends `{ type: "LAB_COMPLETED", score: 100 }`. The React Native app intercepts this in `onMessage` and updates the gamification store.
- **From Native to Web**: Native sends `{ type: "THEME_CHANGE", value: "dark" }` via `webViewRef.current.injectJavaScript(...)` to keep UI aesthetics synced.
