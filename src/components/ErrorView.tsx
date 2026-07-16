import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ 
  message = 'Something went wrong.', 
  onRetry 
}) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  return (
    <View style={styles.container}>
      <MaterialIcons 
        name="error-outline" 
        size={64} 
        color={COLORS.error} 
      />
      <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
        Oops!
      </Text>
      <Text style={[styles.message, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
        {message}
      </Text>
      
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.round,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 16,
  },
});
