import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import { useFood } from '../store';
import { colors } from '../theme';

export default function MyFood({ navigation }) {
  const { myRecipes, deleteRecipe } = useFood();

  const confirmDelete = (r) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${r.name}"?`)) deleteRecipe(r.id);
      return;
    }
    Alert.alert('Delete recipe', `Delete "${r.name}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe(r.id) },
    ]);
  };

  return (
    <SafeAreaView style={s.screen}>
      <Header title="My Recipes" onBack={() => navigation.goBack()} />
      <TouchableOpacity style={s.add} onPress={() => navigation.navigate('RecipeForm')}>
        <Ionicons name="add-circle" size={22} color="#fff" />
        <Text style={s.addText}>Add New Recipe</Text>
      </TouchableOpacity>

      <FlatList
        data={myRecipes}
        numColumns={2}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={<Text style={s.empty}>You haven't added any recipes yet. Tap "Add New Recipe" to publish your first dish.</Text>}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => navigation.navigate('Details', { id: item.id, recipe: item })}
            footer={
              <View style={s.actions}>
                <TouchableOpacity style={[s.act, s.edit]} onPress={() => navigation.navigate('RecipeForm', { recipe: item })}>
                  <Text style={s.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.act, s.del]} onPress={() => confirmDelete(item)}>
                  <Text style={s.delText}>Delete</Text>
                </TouchableOpacity>
              </View>
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  add: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 14, padding: 14, borderRadius: 12, backgroundColor: colors.accent },
  addText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40, paddingHorizontal: 30, fontSize: 15 },
  actions: { flexDirection: 'row', gap: 8, padding: 10, paddingTop: 0 },
  act: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  edit: { borderColor: colors.leaf, backgroundColor: colors.leafSoft },
  editText: { color: colors.leaf, fontWeight: '700' },
  del: { borderColor: colors.accent },
  delText: { color: colors.accent, fontWeight: '700' },
});
