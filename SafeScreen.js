import React from 'react';
import { View, Platform, StatusBar } from 'react-native';

// Adds space at the top so content clears the status bar / notch.
export function SafeAreaView({ style, children }) {
  const top =
    Platform.OS === 'android' ? (StatusBar.currentHeight || 24) :
    Platform.OS === 'ios' ? 50 : 0;
  return <View style={[{ paddingTop: top }, style]}>{children}</View>;
}
