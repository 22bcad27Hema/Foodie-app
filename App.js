import React, { useCallback, useEffect, useState } from 'react';
import { View, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FoodProvider } from './src/store';
import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Favorites from './src/screens/Favorites';
import MyFood from './src/screens/MyFood';
import RecipeForm from './src/screens/RecipeForm';

const SCREENS = { Home, Details, Favorites, MyFood, RecipeForm };

export default function App() {
  // The navigation stack: each entry is a screen name plus its params.
  const [stack, setStack] = useState([{ name: 'Home', params: {} }]);

  const navigate = useCallback((name, params = {}) => {
    setStack((s) => [...s, { name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length > 1) { goBack(); return true; }
      return false;
    });
    return () => sub && sub.remove && sub.remove();
  }, [stack.length, goBack]);

  const navigation = { navigate, goBack };

  return (
    <FoodProvider>
      <StatusBar style="dark" />
      {/* All screens stay mounted; only the top one is visible, so Home keeps its category and scroll position. */}
      {stack.map((entry, i) => {
        const Screen = SCREENS[entry.name];
        const visible = i === stack.length - 1;
        return (
          <View key={i} style={visible ? { flex: 1 } : { display: 'none' }}>
            <Screen navigation={navigation} route={{ params: entry.params }} />
          </View>
        );
      })}
    </FoodProvider>
  );
}
