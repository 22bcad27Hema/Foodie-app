import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FoodProvider } from './src/store';
import Home from './src/screens/Home';
import Details from './src/screens/Details';
import Favorites from './src/screens/Favorites';
import MyFood from './src/screens/MyFood';
import RecipeForm from './src/screens/RecipeForm';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <FoodProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          {/* Every screen draws its own header with a Back button */}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Details" component={Details} />
            <Stack.Screen name="Favorites" component={Favorites} />
            <Stack.Screen name="MyFood" component={MyFood} />
            <Stack.Screen name="RecipeForm" component={RecipeForm} />
          </Stack.Navigator>
        </NavigationContainer>
      </FoodProvider>
    </SafeAreaProvider>
  );
}
