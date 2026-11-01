import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { CATEGORIES, fetchByCategory } from '../api';
import { colors } from '../theme';

export default function Home({ navigation }) {
  const [category, setCategory] = useState('Chicken');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchByCategory(category)
      .then((data) => active && setItems(data))
      .catch(() => active && (setItems([]), setError('Could not load recipes. Check your connection and try again.')))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [category, attempt]);

  return (
    <SafeAreaView style={s.screen}>
      <Header title="Foodie" />
      {/* Horizontal category bar: Favorites, My Food, then 14 recipe categories */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.bar}>
          <TouchableOpacity style={[s.chip, s.special]} onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart" size={15} color="#fff" />
            <Text style={s.specialText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.chip, s.special]} onPress={() => navigation.navigate('MyFood')}>
            <Ionicons name="restaurant" size={15} color="#fff" />
            <Text style={s.specialText}>My Food</Text>
          </TouchableOpacity>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} style={[s.chip, category === c && s.chipOn]} onPress={() => setCategory(c)}>
              <Text style={[s.chipText, category === c && s.chipTextOn]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.accent} size="large" />
      ) : error ? (
        <View style={s.center}>
          <Text style={s.msg}>{error}</Text>
          <TouchableOpacity style={s.btn} onPress={() => setAttempt((n) => n + 1)}>
            <Text style={s.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          key="grid"
          data={items}
          numColumns={2}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 8 }}
          ListEmptyComponent={<Text style={[s.msg, { marginTop: 40 }]}>No recipes in {category} yet.</Text>}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => navigation.navigate('Details', { id: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  bar: { paddingHorizontal: 10, paddingVertical: 12, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  chipOn: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  chipTextOn: { color: '#fff' },
  special: { backgroundColor: colors.accent, borderColor: colors.accent },
  specialText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  center: { alignItems: 'center', padding: 30 },
  msg: { textAlign: 'center', color: colors.muted, fontSize: 15 },
  btn: { marginTop: 14, backgroundColor: colors.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: '#fff', fontWeight: '700' },
});
