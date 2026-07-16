import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS, SPACING, FONTS, RADIUS } from '../constants/theme';

export default function SignupScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('@')) {
        login({
          id: Date.now().toString(),
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
        });
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => router.push('/') }
        ]);
      } else {
        Alert.alert('Error', 'Invalid email address');
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
      <Header title="Sign Up" showBack />
      
      <View style={styles.content}>
        <Text style={[styles.welcomeText, { color: isDark ? COLORS.textLight : COLORS.textDark }]}>
          Create Account
        </Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={isDark ? COLORS.textMutedDark : COLORS.textMutedLight} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDark ? COLORS.textLight : COLORS.textDark }]}
            placeholder="Full Name"
            placeholderTextColor={isDark ? COLORS.textMutedDark : COLORS.textMutedLight}
            value={name}
            onChangeText={setName}
          />
        </View>

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
          style={styles.signupButton} 
          onPress={handleSignup}
          disabled={isLoading}
        >
          <Text style={styles.signupButtonText}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
          <Text style={[styles.loginText, { color: isDark ? COLORS.textMutedDark : COLORS.textMutedLight }]}>
            Already have an account? <Text style={{ color: COLORS.primary, fontFamily: FONTS.bold }}>Log In</Text>
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
  signupButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  signupButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  loginLink: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  loginText: {
    fontFamily: FONTS.medium,
    fontSize: 15,
  }
});
