import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function Header({ title, onBack, right }) {
  return (
    <View style={s.bar}>
      <View style={s.side}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={s.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={22} color={colors.ink} />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={s.title} numberOfLines={1}>{title}</Text>
      <View style={[s.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.bg },
  side: { width: 80 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 16, color: colors.ink, fontWeight: '600' },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.ink },
});
