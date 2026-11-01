import React from 'react';
import { Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from '../components/SafeScreen';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { useFood } from '../store';
import { colors } from '../theme';

export default function Favorites({ navigation }) {
  const { favorites, myRecipes } = useFood();

  const open = (f) => {
    if (f.mine) {
      const full = myRecipes.find((r) => r.id === f.id);
      navigation.navigate('Details', { id: f.id, recipe: full });
    } else {
      navigation.navigate('Details', { id: f.id });
    }
  };

  return (
    <SafeAreaView style={s.screen}>
      <Header title="Favorites" onBack={() => navigation.goBack()} />
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={<Text style={s.empty}>No favorites yet. Tap the heart on a recipe to save it here.</Text>}
        renderItem={({ item }) => <RecipeCard recipe={item} onPress={() => open(item)} />}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 50, paddingHorizontal: 30, fontSize: 15 },
});
