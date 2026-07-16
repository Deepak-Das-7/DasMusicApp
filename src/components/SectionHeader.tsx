import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS } from '../constants/theme';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  actionText, 
  onActionPress 
}) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
        {title}
      </Text>
      
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.actionText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 22,
  },
  actionText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    textTransform: 'uppercase',
  },
});
