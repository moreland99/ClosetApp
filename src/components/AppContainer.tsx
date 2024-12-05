// src/components/AppContainer.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const AppContainer = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

export default AppContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
});
