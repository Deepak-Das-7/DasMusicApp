import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  onSubmit,
  placeholder = 'Search songs, artists...' 
}) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}>
      <MaterialIcons 
        name="search" 
        size={24} 
        color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} 
        style={styles.icon}
      />
      
      <TextInput
        style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearIcon}>
          <MaterialIcons 
            name="close" 
            size={20} 
            color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 16,
    height: '100%',
  },
  clearIcon: {
    padding: SPACING.xs,
  },
});
