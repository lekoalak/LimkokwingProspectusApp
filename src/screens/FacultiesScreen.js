// src/screens/FacultiesScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import { FACULTIES } from '../data/faculties';

const FacultiesScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filtered = FACULTIES.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faculties</Text>
        <Text style={styles.headerSub}>Choose your path to success</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={COLORS.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search faculties..."
            placeholderTextColor={COLORS.gray}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {filtered.map((faculty) => (
          <TouchableOpacity
            key={faculty.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate('FacultyDetail', { facultyId: faculty.id })
            }
            activeOpacity={0.85}
          >
            <ImageBackground
              source={{ uri: faculty.image }}
              style={styles.cardBg}
              imageStyle={styles.cardBgImage}
            >
              <View style={styles.cardOverlay}>
                <View style={styles.cardTop}>
                  <View style={[styles.iconCircle, { backgroundColor: faculty.color }]}>
                    <Ionicons name={faculty.icon} size={26} color="#fff" />
                  </View>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardCoursesCount}>
                      {faculty.courses.length} programmes
                    </Text>
                    <View style={styles.cardLevels}>
                      {[...new Set(faculty.courses.map((c) => c.level))].map((lvl) => (
                        <View
                          key={lvl}
                          style={[styles.lvlBadge, { borderColor: faculty.color }]}
                        >
                          <Text style={[styles.lvlText, { color: faculty.color }]}>
                            {lvl}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={28} color={faculty.color} />
                </View>
                <Text style={styles.cardName}>{faculty.name}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {faculty.description}
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 3,
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  list: {
    padding: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    height: 180,
    ...SHADOWS.large,
  },
  cardBg: { flex: 1 },
  cardBgImage: { borderRadius: 20 },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 18,
    justifyContent: 'space-between',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMeta: { flex: 1 },
  cardCoursesCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 4,
  },
  cardLevels: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  lvlBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  lvlText: { fontSize: 10, fontWeight: '700' },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    lineHeight: 17,
  },
});

export default FacultiesScreen;
