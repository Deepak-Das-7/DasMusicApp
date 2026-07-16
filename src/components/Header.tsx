import { MaterialIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { useThemeStore } from '../store/useThemeStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'DasMusic',
  showBack = false,
  rightIcon,
  onRightPress
}) => {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  const router = useRouter();
  const pathname = usePathname();

  // If we're on the home screen, maybe don't show back
  const canGoBack = showBack || (router.canGoBack() && pathname !== '/');

  return (
    <SafeAreaView style={{ backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }}>
      <View style={styles.container}>
        {canGoBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <MaterialIcons
              name="arrow-back"
              size={28}
              color={isDark ? COLORS.textLight : COLORS.textDark}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <Text style={[styles.title, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
          {title}
        </Text>

        {rightIcon ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
          >
            <MaterialIcons
              name={rightIcon}
              size={28}
              color={isDark ? COLORS.textLight : COLORS.textDark}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  iconButton: {
    padding: SPACING.xs,
  },
  iconPlaceholder: {
    width: 28 + SPACING.xs * 2,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
  }
});
