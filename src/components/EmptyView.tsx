import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS } from '../constants/theme';

interface EmptyViewProps {
  title?: string;
  message?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}

export const EmptyView: React.FC<EmptyViewProps> = ({ 
  title = 'No Data', 
  message = 'Nothing to show here.', 
  icon = 'inbox' 
}) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  return (
    <View style={styles.container}>
      <MaterialIcons 
        name={icon} 
        size={64} 
        color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} 
      />
      <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
  },
});
