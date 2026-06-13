# State Management Design - SkillSprint

## Global State (Zustand)
Zustand is used for client-side states that are not strictly coupled to server data.
- **useAuthStore**: Handles `user`, `accessToken`, and `logout()` triggers.
- **useAppStore**: Manages current theme (dark/light), offline mode toggle, and active modal overlays.
- **useGamificationStore**: Manages current streak, XP updates locally before syncing, enabling immediate UI feedback.

## Server State (TanStack React Query)
React Query handles all asynchronous fetching, caching, synchronizing, and updating server state.
- **useCourses**: Fetches course lists with pagination and stale-time configured to 5 minutes.
- **useFeed**: Infinite query pulling video batches.
- **Mutations**: E.g., `useMarkComplete` optimistically updates the cache so progress rings fill immediately.
