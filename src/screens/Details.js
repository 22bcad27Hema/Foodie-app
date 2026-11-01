import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { fetchRecipe } from '../api';
import { useFood } from '../store';
import { colors } from '../theme';

export default function Details({ navigation, route }) {
  const { id, recipe: passed } = route.params;
  const { myRecipes, isFavorite, toggleFavorite } = useFood();
  const [recipe, setRecipe] = useState(passed || null);
  const [error, setError] = useState('');

  useEffect(() => {
    // My Food recipes live on the device; everything else is fetched by id.
    const mine = myRecipes.find((r) => r.id === id);
    if (mine) { setRecipe(mine); return; }
    if (passed) return;
    let active = true;
    fetchRecipe(id).then((r) => active && setRecipe(r)).catch(() => active && setError('Could not load this recipe.'));
    return () => { active = false; };
  }, [id, myRecipes]);

  const fav = recipe ? isFavorite(recipe.id) : false;

  const heart = recipe && (
    <TouchableOpacity onPress={() => toggleFavorite(recipe)} accessibilityLabel="Toggle favorite">
      <Ionicons name={fav ? 'heart' : 'heart-outline'} size={28} color={colors.accent} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.screen}>
      <Header title="Recipe" onBack={() => navigation.goBack()} right={heart} />
      {!recipe ? (
        error ? <Text style={s.err}>{error}</Text> : <ActivityIndicator style={{ marginTop: 40 }} color={colors.accent} size="large" />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {recipe.image ? <Image source={{ uri: recipe.image }} style={s.hero} /> : null}
          <View style={s.body}>
            <Text style={s.title}>{recipe.name}</Text>

            {recipe.prepTime ? (
              <View style={s.stats}>
                <Stat label="Prep time" value={recipe.prepTime} />
                <Stat label="Servings" value={String(recipe.servings)} />
                <Stat label="Calories" value={`${recipe.calories} kcal`} />
                <Stat label="Difficulty" value={recipe.difficulty} />
              </View>
            ) : null}

            <Text style={s.h2}>Ingredients</Text>
            {recipe.ingredients.map((line, i) => (
              <Text key={i} style={s.item}>• {line}</Text>
            ))}

            <Text style={s.h2}>Instructions</Text>
            {recipe.steps.map((line, i) => (
              <View key={i} style={s.step}>
                <Text style={s.stepNo}>{i + 1}</Text>
                <Text style={s.stepText}>{line}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const Stat = ({ label, value }) => (
  <View style={s.stat}>
    <Text style={s.statVal}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  hero: { width: '100%', aspectRatio: 1.3 },
  body: { padding: 18 },
  title: { fontSize: 26, fontWeight: '800', color: colors.ink },
  stats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, backgroundColor: colors.leafSoft, borderRadius: 14, padding: 6 },
  stat: { width: '50%', padding: 10 },
  statVal: { fontSize: 17, fontWeight: '800', color: colors.leaf },
  statLabel: { fontSize: 13, color: colors.muted, marginTop: 2 },
  h2: { fontSize: 20, fontWeight: '800', color: colors.ink, marginTop: 24, marginBottom: 8 },
  item: { fontSize: 16, color: colors.ink, lineHeight: 24 },
  step: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  stepNo: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent, color: '#fff', textAlign: 'center', lineHeight: 26, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 16, lineHeight: 23, color: colors.ink },
  err: { textAlign: 'center', marginTop: 40, color: colors.muted },
});
