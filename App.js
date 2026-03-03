// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RatingsProvider } from './src/context/RatingsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <RatingsProvider>
        <AppNavigator />
      </RatingsProvider>
    </SafeAreaProvider>
  );
}
