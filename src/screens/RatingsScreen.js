// src/screens/RatingsScreen.js
import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import { FACULTIES } from '../data/faculties';
import { RatingsContext } from '../context/RatingsContext';

const MAX_RATING = 6;

const RatingsScreen = ({ navigation }) => {
  const { ratings, resetRatings } = useContext(RatingsContext);

  const allCourses = FACULTIES.flatMap((f) =>
    f.courses.map((c) => ({
      ...c,
      facultyName: f.shortName,
      facultyColor: f.color,
      facultyIcon: f.icon,
      rating: ratings[c.id] ?? 0,
    }))
  );

  const ratedCourses = allCourses.filter((c) => c.rating > 0);
  const unratedCount = allCourses.length - ratedCourses.length;

  const sorted = [...ratedCourses].sort((a, b) => b.rating - a.rating);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Ratings</Text>
        <Text style={styles.headerSub}>
          {ratedCourses.length} rated · {unratedCount} unrated
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {sorted.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>No Ratings Yet</Text>
            <Text style={styles.emptyDesc}>
              Browse courses and rate them to see your favourites here.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('Faculties')}
            >
              <Text style={styles.emptyBtnText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Top Rated Courses</Text>
            {sorted.map((course, index) => (
              <TouchableOpacity
                key={course.id}
                style={styles.ratingRow}
                onPress={() =>
                  navigation.navigate('CourseDetail', {
                    courseId: course.id,
                    facultyId: FACULTIES.find((f) =>
                      f.courses.some((c) => c.id === course.id)
                    )?.id,
                  })
                }
                activeOpacity={0.8}
              >
                <Text style={styles.rankNum}>#{index + 1}</Text>
                <Image source={{ uri: course.image }} style={styles.courseThumb} />
                <View style={styles.courseInfo}>
                  <View style={styles.courseInfoTop}>
                    <View
                      style={[
                        styles.facultyTag,
                        { backgroundColor: course.facultyColor + '20' },
                      ]}
                    >
                      <Ionicons
                        name={course.facultyIcon}
                        size={10}
                        color={course.facultyColor}
                      />
                      <Text style={[styles.facultyTagText, { color: course.facultyColor }]}>
                        {course.facultyName}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.courseName} numberOfLines={2}>
                    {course.name}
                  </Text>
                  {/* Stars */}
                  <View style={styles.starsRow}>
                    {Array.from({ length: MAX_RATING }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < course.rating ? 'star' : 'star-outline'}
                        size={14}
                        color={i < course.rating ? COLORS.accent : COLORS.lightGray}
                      />
                    ))}
                    <Text style={styles.ratingNum}>{course.rating}/{MAX_RATING}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.resetBtn} onPress={resetRatings}>
              <Ionicons name="trash-outline" size={16} color={COLORS.error} />
              <Text style={styles.resetBtnText}>Reset All Ratings</Text>
            </TouchableOpacity>
          </>
        )}
        <View style={{ height: 30 }} />
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
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  headerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 3 },
  list: { padding: 16 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 8 },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 30,
  },
  emptyBtn: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  sectionLabel: {
    fontWeight: '800',
    fontSize: 14,
    color: COLORS.textLight,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  ratingRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    ...SHADOWS.small,
  },
  rankNum: {
    width: 26,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.accent,
    textAlign: 'center',
  },
  courseThumb: { width: 56, height: 56, borderRadius: 10 },
  courseInfo: { flex: 1 },
  courseInfoTop: { marginBottom: 3 },
  facultyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  facultyTagText: { fontSize: 10, fontWeight: '700' },
  courseName: { fontSize: 13, fontWeight: '700', color: COLORS.text, lineHeight: 17, marginBottom: 5 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingNum: { fontSize: 11, color: COLORS.textLight, marginLeft: 4, fontWeight: '600' },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.error + '50',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 8,
    marginTop: 16,
  },
  resetBtnText: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
});

export default RatingsScreen;
