import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Imported from the shared workspace package — the exact same source the web
// app uses. This is the proof that packages/core is cross-platform.
import { HABIT_CATEGORIES } from '@rewire/core';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function HomeScreen() {
  const { session, loading } = useAuth();

  const status = loading
    ? 'Checking session…'
    : session
      ? `Signed in as ${session.user.email ?? 'your account'}`
      : 'Not signed in';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Rewire
        </ThemedText>
        <ThemedText type="small">{status}</ThemedText>

        <ThemedText type="code" style={styles.section}>
          what would you like to change?
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.list}>
          {HABIT_CATEGORIES.map((c) => (
            <ThemedText key={c.value} style={styles.item}>
              {c.emoji}  {c.label}
            </ThemedText>
          ))}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    gap: Spacing.three,
  },
  title: { textAlign: 'left' },
  section: { textTransform: 'uppercase', marginTop: Spacing.three },
  list: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
  },
  item: { fontSize: 16 },
});
