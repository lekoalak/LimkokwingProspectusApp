// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import { FACULTIES } from '../data/faculties';
import FacultyCard from '../components/FacultyCard';

const HomeScreen = ({ navigation }) => {
  const stats = [
    { icon: 'school', label: 'Faculties', value: '5' },
    { icon: 'book', label: 'Courses', value: '25+' },
    { icon: 'people', label: 'Students', value: '30K+' },
    { icon: 'globe', label: 'Countries', value: '150+' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero Banner */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.logoBadge}>
              <Ionicons name="school" size={22} color={COLORS.accent} />
              <Text style={styles.logoText}>LUCT</Text>
            </View>
            <Text style={styles.heroTitle}>Limkokwing{'\n'}University</Text>
            <Text style={styles.heroSubtitle}>
              Lesotho's Most Award-Winning University
            </Text>
            <View style={styles.heroBtns}>
              <TouchableOpacity
                style={styles.heroBtnPrimary}
                onPress={() => navigation.navigate('Faculties')}
              >
                <Text style={styles.heroBtnPrimaryText}>Explore Courses</Text>
                <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroBtnSecondary}
                onPress={() => navigation.navigate('Quiz')}
              >
                <Text style={styles.heroBtnSecondaryText}>Career Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name={s.icon} size={18} color={COLORS.accent} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Faculties Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Faculties</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Faculties')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.facultiesGrid}>
            {FACULTIES.map((faculty) => (
              <FacultyCard
                key={faculty.id}
                faculty={faculty}
                onPress={() =>
                  navigation.navigate('FacultyDetail', { facultyId: faculty.id })
                }
              />
            ))}
          </View>
        </View>

        {/* Career Quiz CTA */}
        <TouchableOpacity
          style={styles.quizCta}
          onPress={() => navigation.navigate('Quiz')}
        >
          <View style={styles.quizCtaLeft}>
            <Text style={styles.quizCtaTitle}>Not sure which course?</Text>
            <Text style={styles.quizCtaDesc}>
              Take our 5-question career quiz and get personalized recommendations.
            </Text>
            <View style={styles.quizCtaBtn}>
              <Text style={styles.quizCtaBtnText}>Start Quiz →</Text>
            </View>
          </View>
          <Ionicons name="help-circle" size={64} color="rgba(255,255,255,0.15)" />
        </TouchableOpacity>

        {/* About */}
        <View style={styles.about}>
          <Ionicons name="information-circle" size={22} color={COLORS.accent} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.aboutTitle}>About Limkokwing</Text>
            <Text style={styles.aboutText}>
              Based in Maseru, Lesotho. Part of the global Limkokwing network with
              students from 150+ countries across 3 continents. Internationally
              recognized for creative and technology education.
            </Text>
            <Text style={styles.aboutContact}>
              📍 Moshoeshoe Road, Maseru   📞 +266 2231 5767
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  scroll: { paddingBottom: 20 },
  hero: {
    height: 340,
    marginBottom: -1,
  },
  heroImage: {},
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 22, 40, 0.75)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  logoText: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 2,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 20,
  },
  heroBtns: { flexDirection: 'row', gap: 10 },
  heroBtnPrimary: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroBtnPrimaryText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  heroBtnSecondary: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
  },
  heroBtnSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statCard: { flex: 1, alignItems: 'center', gap: 3 },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: { color: '#fff', fontWeight: '900', fontSize: 16 },
  statLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  seeAll: { color: COLORS.accent, fontWeight: '700', fontSize: 13 },
  facultiesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  quizCta: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  quizCtaLeft: { flex: 1 },
  quizCtaTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  quizCtaDesc: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 14,
  },
  quizCtaBtn: {
    backgroundColor: COLORS.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quizCtaBtnText: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  about: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    ...SHADOWS.small,
  },
  aboutTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 6 },
  aboutText: { fontSize: 12, color: COLORS.textLight, lineHeight: 18 },
  aboutContact: { fontSize: 11, color: COLORS.textLight, marginTop: 8 },
});

export default HomeScreen;
