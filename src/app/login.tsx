import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      // Dummy validation for mock auth
      if (email.includes('@')) {
        login({
          id: Date.now().toString(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
        });
        Alert.alert('Success', 'Logged in successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Invalid credentials');
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Log In" showBack />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="person" size={64} color={COLORS.primary} />
        </View>
        <Text style={[styles.welcomeText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
          Welcome Back
        </Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark }]}
            placeholder="Email Address"
            placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark }]}
            placeholder="Password"
            placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')} style={styles.signupLink}>
          <Text style={[styles.signupText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            Don't have an account? <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150,150,150,0.2)',
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  signupLink: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  signupText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  }
});
