import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// Imported from the shared workspace package — the exact same source the web
// app uses. Proof that packages/core is cross-platform.
import { HABIT_CATEGORIES } from '@rewire/core';

import { useAuth } from '../lib/auth';

export function HomeScreen() {
  const { session, signOut } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Rewire</Text>
          <Text style={styles.subtitle}>
            {session?.user.email ?? 'Signed in'}
          </Text>
        </View>
        <Pressable onPress={signOut} accessibilityRole="button">
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>What would you like to change?</Text>
      <View style={styles.list}>
        {HABIT_CATEGORIES.map((c) => (
          <View key={c.value} style={styles.item}>
            <Text style={styles.emoji}>{c.emoji}</Text>
            <Text style={styles.itemLabel}>{c.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f17' },
  content: { padding: 24, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: '#e9fdf3' },
  subtitle: { fontSize: 14, color: '#8fb9a6' },
  signOut: { color: '#8fb9a6', fontSize: 14, fontWeight: '600' },
  section: { fontSize: 13, textTransform: 'uppercase', color: '#8fb9a6', letterSpacing: 1 },
  list: { gap: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#12352788',
  },
  emoji: { fontSize: 22 },
  itemLabel: { fontSize: 16, color: '#e9fdf3', fontWeight: '600' },
});
