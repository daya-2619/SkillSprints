// src/navigation/router.tsx
import { Stack } from "expo-router";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  // Authentication logic hook here
  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <RequireAuth>
      <Stack>
        {/* Onboarding */}
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        {/* Auth */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        {/* Main app */}
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="CourseDetail" options={{ headerShown: false }} />
        <Stack.Screen name="tutor" options={{ headerShown: false }} />
        <Stack.Screen name="LiveSession" options={{ headerShown: false }} />
        {/* Admin / Instructor */}
        <Stack.Screen name="AdminDashboard" options={{ headerShown: false }} />
        <Stack.Screen name="InstructorDashboard" options={{ headerShown: false }} />
      </Stack>
    </RequireAuth>
  );
}
