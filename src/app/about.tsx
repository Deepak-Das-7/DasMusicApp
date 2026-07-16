import React from 'react';
import { View, StyleSheet, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

export default function AboutScreen() {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const renderLink = (title: string, icon: keyof typeof MaterialIcons.glyphMap, url: string) => (
    <TouchableOpacity 
      style={[styles.linkContainer, { backgroundColor: isDark ? COLORS.surfaceDark : COLORS.surfaceLight }]}
      onPress={() => openLink(url)}
    >
      <MaterialIcons name={icon} size={24} color={COLORS.primary} />
      <Text style={[styles.linkTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
        {title}
      </Text>
      <MaterialIcons name="open-in-new" size={20} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="About" showBack />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <MaterialIcons name="music-note" size={60} color={COLORS.white} />
          </View>
          <Text style={[styles.appName, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            DasMusic
          </Text>
          <Text style={[styles.version, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.description, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            A beautiful, seamless music streaming experience built with React Native and Expo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            Links
          </Text>
          {renderLink('Official Website', 'language', 'https://example.com')}
          {renderLink('Privacy Policy', 'privacy-tip', 'https://example.com/privacy')}
          {renderLink('Terms of Service', 'description', 'https://example.com/terms')}
          {renderLink('GitHub', 'code', 'https://github.com/')}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
            Open Source
          </Text>
          <Text style={[styles.bodyText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            This application uses various open-source libraries:
          </Text>
          <View style={styles.bulletList}>
            {['React Native', 'Expo', 'Zustand', 'React Query', 'Axios', 'react-native-gesture-handler', 'react-native-reanimated'].map((lib, index) => (
              <Text key={index} style={[styles.bulletItem, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
                • {lib}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  version: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginBottom: SPACING.lg,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: SPACING.md,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  linkTitle: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 16,
    marginLeft: SPACING.md,
  },
  bodyText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginBottom: SPACING.md,
    lineHeight: 24,
  },
  bulletList: {
    paddingLeft: SPACING.sm,
  },
  bulletItem: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: SPACING.xs,
  }
});
