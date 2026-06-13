# Frontend Architecture - SkillSprint

## Frameworks & Libraries
- **React Native (Expo)**: Write once, deploy to iOS/Android.
- **Expo Router**: File-based routing, deep linking support out-of-the-box.
- **Zustand**: Global state management (e.g., Auth, Offline Queue, Themes).
- **React Query**: Server-state management (Caching, background sync).
- **React Native Reanimated**: 60fps animations for the TikTok-style feed and UI transitions.
- **React Hook Form + Zod**: Performant, typed form validation.

## App Structure
- `src/app/`: Expo Router screens grouped by layout `(auth)`, `(main)`, `(instructor)`, `(admin)`.
- `src/components/`: Reusable UI elements (Buttons, Cards, VideoPlayer).
- `src/hooks/`: React Query custom hooks.
- `src/store/`: Zustand stores.
- `src/theme/`: Colors, typography, spacing.
- `src/utils/`: Helpers, offline storage wrappers (SecureStore / MMKV).
