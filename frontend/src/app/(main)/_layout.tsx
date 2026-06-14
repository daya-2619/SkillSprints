import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

const T = {
  bg: '#0d0e12',
  surface: '#161822',
  primary: '#6366f1',
  textMuted: '#9ca3af',
  border: '#2e3248',
};

export default function MainLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: T.surface },
        headerTintColor: '#f3f4f6',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerRight: () => (
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => signOut()}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: T.surface,
          borderTopColor: T.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: T.primary,
        tabBarInactiveTintColor: T.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎬</Text>,
          headerTitle: 'SkillSprint Feed',
        }}
      />
      <Tabs.Screen
        name="tutor"
        options={{
          title: 'AI Tutor',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🤖</Text>,
          headerTitle: 'AI Tutor',
        }}
      />
      <Tabs.Screen
        name="CourseDetail"
        options={{
          title: 'Courses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📚</Text>,
          headerTitle: 'Course Detail',
        }}
      />
      <Tabs.Screen
        name="LiveSession"
        options={{
          title: 'Live',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📡</Text>,
          headerTitle: 'Live Session',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  signOutBtn: {
    marginRight: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2e3248',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  signOutText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
  },
});
