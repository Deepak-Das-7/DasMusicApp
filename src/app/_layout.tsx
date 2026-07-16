import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '../store/useThemeStore';
import { COLORS } from '../constants/theme';
import { MiniPlayer } from '../components/MiniPlayer';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

const queryClient = new QueryClient();

export default function Layout() {
  const { themeMode } = useThemeStore();
  const isDark = themeMode === 'dark' || themeMode === 'system';
  
  // Initialize the audio engine at root level so it stays alive across screens
  useAudioPlayer();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { backgroundColor: isDark ? COLORS.backgroundDark : COLORS.backgroundLight }]}>
        <StatusBar 
          barStyle={isDark ? 'light-content' : 'dark-content'} 
          backgroundColor="transparent" 
          translucent 
        />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="search" />
          <Stack.Screen name="favourites" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="player" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        </Stack>
        <MiniPlayer />
        </View>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
