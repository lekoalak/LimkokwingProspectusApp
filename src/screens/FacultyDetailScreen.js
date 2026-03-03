// src/screens/FacultyDetailScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import { FACULTIES } from '../data/faculties';
import CourseCard from '../components/CourseCard';
import { RatingsContext } from '../context/RatingsContext';

const FacultyDetailScreen = ({ route, navigation }) => {
  const { facultyId } = route.params;
  const faculty = FACULTIES.find((f) => f.id === facultyId);
  const { ratings, updateRating } = useContext(RatingsContext);

  if (!faculty) return null;

  const coursesWithRatings = faculty.courses.map((c) => ({
    ...c,
    rating: ratings[c.id] ?? 0,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <ImageBackground source={{ uri: faculty.image }} style={styles.hero}>
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={[styles.iconBadge, { backgroundColor: faculty.color }]}>
              <Ionicons name={faculty.icon} size={28} color="#fff" />
            </View>
            <Text style={styles.facultyName}>{faculty.name}</Text>
            <Text style={styles.facultyDesc}>{faculty.description}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statNum}>{faculty.courses.length}</Text>
                <Text style={styles.statLabel}>Programmes</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: faculty.color }]} />
              <View style={styles.stat}>
                <Text style={styles.statNum}>
                  {[...new Set(faculty.courses.map((c) => c.level))].join(' / ')}
                </Text>
                <Text style={styles.statLabel}>Levels</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Courses */}
        <View style={styles.coursesSection}>
          <Text style={styles.sectionTitle}>Available Programmes</Text>
          {coursesWithRatings.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              facultyColor={faculty.color}
              onPress={() =>
                navigation.navigate('CourseDetail', {
                  courseId: course.id,
                  facultyId: faculty.id,
                })
              }
              onRate={(courseId, newRating) => updateRating(courseId, newRating)}
            />
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  hero: { height: 340 },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: 24,
    justifyContent: 'flex-end',
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  facultyName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 8,
  },
  facultyDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  stat: { flex: 1, alignItems: 'center' },
  statNum: { color: '#fff', fontWeight: '800', fontSize: 15 },
  statLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30, opacity: 0.6 },
  coursesSection: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
});

export default FacultyDetailScreen;
