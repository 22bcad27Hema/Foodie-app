import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function RecipeCard({ recipe, onPress, footer }) {
  return (
    <View style={s.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        {recipe.image ? (
          <Image source={{ uri: recipe.image }} style={s.img} />
        ) : (
          <View style={[s.img, s.noImg]}><Text style={{ color: colors.muted }}>No photo</Text></View>
        )}
        <Text style={s.name} numberOfLines={2}>{recipe.name}</Text>
      </TouchableOpacity>
      {footer}
    </View>
  );
}

const s = StyleSheet.create({
  card: { flex: 1, margin: 6, backgroundColor: colors.card, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  img: { width: '100%', aspectRatio: 1, backgroundColor: colors.leafSoft },
  noImg: { alignItems: 'center', justifyContent: 'center' },
  name: { padding: 10, fontSize: 15, fontWeight: '700', color: colors.ink, minHeight: 56 },
});
