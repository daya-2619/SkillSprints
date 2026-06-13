# Notification Architecture - SkillSprint

## Providers
- **Expo Push Notifications service**: Unifies APNs (Apple) and FCM (Firebase).

## Flow
1. **Registration**: On app startup, `expo-notifications` requests permissions and retrieves an Expo Push Token.
2. **Backend Storage**: The token is sent to the FastAPI backend and stored in the `Users` table (or a dedicated `DeviceTokens` table).
3. **Triggering**:
   - **Celery Beats**: Runs scheduled tasks (e.g., daily 8 PM learning reminder if the user hasn't opened the app).
   - **Event-Driven**: When a live session starts, the backend issues an API call to Expo's Push API, passing the room ID for deep linking.

## Handling
- Foreground: Render in-app toast.
- Background: System tray notification. Tapping opens via Expo Router deep links (e.g., `skillsprint://live/123`).
