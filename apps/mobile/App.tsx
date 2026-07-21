/**
 * Rewire mobile (bare React Native — no Expo).
 *
 * @format
 */

import 'react-native-url-polyfill/auto';

import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/lib/auth';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';

function Gate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#16a34a" />
      </View>
    );
  }
  return session ? <HomeScreen /> : <LoginScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0b1f17" />
      <SafeAreaView style={styles.container}>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1f17' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b1f17' },
});

export default App;
