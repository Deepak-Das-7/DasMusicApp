import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Header } from '../components/Header';
import { useThemeStore } from '../store/useThemeStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useSearchStore } from '../store/useSearchStore';
import { useAuthStore } from '../store/useAuthStore';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  const { themeMode, setThemeMode } = useThemeStore();
  const { clearHistory } = useHistoryStore();
  const { clearSearches } = useSearchStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const handleClearHistory = () => {
    Alert.alert('Clear History', 'Are you sure you want to clear your recently played songs?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearHistory }
    ]);
  };

  const handleClearSearches = () => {
    Alert.alert('Clear Searches', 'Are you sure you want to clear your recent searches?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearSearches }
    ]);
  };

  const renderSettingItem = (title: string, icon: keyof typeof MaterialIcons.glyphMap, rightElement: React.ReactNode, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.itemContainer, { borderBottomColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <MaterialIcons name={icon} size={24} color={isDark ? COLORS.textLight : COLORS.textDark} />
        <Text style={[styles.itemTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>{title}</Text>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Settings" showBack />
      
      <View style={styles.content}>
        
        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.primary : COLORS.secondary }]}>
          Account
        </Text>
        
        {user ? (
          <>
            {renderSettingItem(
              `Logged in as ${user.name}`, 
              'account-circle', 
              <MaterialIcons name="check" size={24} color={COLORS.primary} />
            )}
            {renderSettingItem(
              'Log Out', 
              'logout', 
              <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
              () => Alert.alert('Log Out', 'Are you sure you want to log out?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: logout }
              ])
            )}
          </>
        ) : (
          <>
            {renderSettingItem(
              'Log In', 
              'login', 
              <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
              () => router.push('/login')
            )}
            {renderSettingItem(
              'Sign Up', 
              'person-add', 
              <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
              () => router.push('/signup')
            )}
          </>
        )}

        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.primary : COLORS.secondary }]}>
          Library
        </Text>
        
        {renderSettingItem(
          'My Playlists', 
          'queue-music', 
          <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
          () => router.push('/playlists')
        )}

        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.primary : COLORS.secondary }]}>
          Preferences
        </Text>
        
        {renderSettingItem(
          'Dark Mode', 
          'dark-mode', 
          <Switch 
            value={isDark} 
            onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')} 
            trackColor={{ false: COLORS.textMutedLight, true: COLORS.primary }}
          />
        )}
        
        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.primary : COLORS.secondary }]}>
          Data
        </Text>
        
        {renderSettingItem(
          'Clear Play History', 
          'history', 
          <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
          handleClearHistory
        )}
        
        {renderSettingItem(
          'Clear Search History', 
          'search', 
          <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
          handleClearSearches
        )}

        <Text style={[styles.sectionTitle, { color: isDark ? COLORS.primary : COLORS.secondary }]}>
          About
        </Text>
        
        {renderSettingItem(
          'About DasMusic', 
          'info-outline', 
          <MaterialIcons name="chevron-right" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />,
          () => router.push('/about')
        )}

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            DasMusic App v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginLeft: SPACING.md,
  },
  versionContainer: {
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
  }
});
