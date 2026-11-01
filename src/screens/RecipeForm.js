import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import Header from '../components/Header';
import { useFood } from '../store';
import { colors } from '../theme';

const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean);

export default function RecipeForm({ navigation, route }) {
  const editing = route.params && route.params.recipe;
  const { addRecipe, updateRecipe } = useFood();

  const [name, setName] = useState(editing ? editing.name : '');
  const [image, setImage] = useState(editing ? editing.image : null);
  const [ingredients, setIngredients] = useState(editing ? editing.ingredients.join('\n') : '');
  const [steps, setSteps] = useState(editing ? editing.steps.join('\n') : '');
  const [error, setError] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const save = () => {
    if (!name.trim()) return setError('Enter a recipe name.');
    if (!image) return setError('Upload a photo of your dish.');
    if (!lines(ingredients).length) return setError('Add at least one ingredient.');
    if (!lines(steps).length) return setError('Add at least one step.');

    const data = { name: name.trim(), image, ingredients: lines(ingredients), steps: lines(steps) };
    if (editing) updateRecipe(editing.id, data);
    else addRecipe(data);
    navigation.goBack(); // back to My Recipes, where the recipe is now listed
  };

  return (
    <SafeAreaView style={s.screen}>
      <Header title={editing ? 'Edit Recipe' : 'New Recipe'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.form} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>Recipe name</Text>
          <TextInput style={s.input} value={name} onChangeText={setName} placeholder="e.g. Lemon rice" placeholderTextColor={colors.muted} />

          <Text style={s.label}>Photo</Text>
          <TouchableOpacity style={s.picker} onPress={pickImage}>
            {image ? <Image source={{ uri: image }} style={s.preview} /> : <Text style={s.pickerText}>Tap to upload an image</Text>}
          </TouchableOpacity>
          {image ? <Text style={s.change} onPress={pickImage}>Change photo</Text> : null}

          <Text style={s.label}>Ingredients (one per line)</Text>
          <TextInput style={[s.input, s.multi]} value={ingredients} onChangeText={setIngredients} multiline placeholder={'2 cups rice\n1 lemon\n1 tsp turmeric'} placeholderTextColor={colors.muted} />

          <Text style={s.label}>Steps (one per line)</Text>
          <TextInput style={[s.input, s.multi]} value={steps} onChangeText={setSteps} multiline placeholder={'Cook the rice.\nTemper the spices.\nMix and serve.'} placeholderTextColor={colors.muted} />

          {error ? <Text style={s.error}>{error}</Text> : null}

          <TouchableOpacity style={s.save} onPress={save}>
            <Text style={s.saveText}>Save Recipe</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  form: { padding: 18, paddingBottom: 50 },
  label: { fontSize: 15, fontWeight: '700', color: colors.ink, marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 10, padding: 12, fontSize: 16, color: colors.ink },
  multi: { minHeight: 120, textAlignVertical: 'top' },
  picker: { height: 180, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.leaf, backgroundColor: colors.leafSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  pickerText: { color: colors.leaf, fontWeight: '700' },
  preview: { width: '100%', height: '100%' },
  change: { color: colors.accent, fontWeight: '700', marginTop: 8 },
  error: { color: colors.accent, marginTop: 14, fontWeight: '600' },
  save: { marginTop: 22, backgroundColor: colors.accent, padding: 15, borderRadius: 12, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
