// src/screens/CourseDetailScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FACULTIES } from '../data/faculties';
import RatingStars from '../components/RatingStars';
import { RatingsContext } from '../context/RatingsContext';

// YouTube player — uses iframe on web, WebView on mobile
const YouTubePlayer = ({ youtubeId, style }) => {
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  if (Platform.OS === 'web') {
    // On web: use a plain HTML iframe via dangerouslySetInnerHTML
    return (
      <View style={style}>
        <iframe
          width="100%"
          height="100%"
          src={embedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: 'none' }}
        />
      </View>
    );
  }

  // On mobile: use WebView
  try {
    const { WebView } = require('react-native-webview');
    return (
      <WebView
        style={style}
        source={{ uri: embedUrl }}
        allowsFullscreenVideo
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
      />
    );
  } catch (e) {
    return (
      <View style={[style, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }]}>
        <Text style={{ color: '#fff' }}>Video not available on this platform</Text>
      </View>
    );
  }
};

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId, facultyId } = route.params;
  const faculty = FACULTIES.find((f) => f.id === facultyId);
  const course = faculty?.courses.find((c) => c.id === courseId);
  const { ratings, updateRating } = useContext(RatingsContext);
  const rating = ratings[courseId] ?? 0;
  const [rateAnim] = useState(new Animated.Value(1));
  const [showVideo, setShowVideo] = useState(false);

  if (!course || !faculty) return null;

  const handleRatePress = () => {
    const newRating = rating < 6 ? rating + 1 : 6;
    updateRating(courseId, newRating);
    Animated.sequence([
      Animated.timing(rateAnim, { toValue: 1.06, duration: 80, useNativeDriver: true }),
      Animated.spring(rateAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: faculty.color + '22' }]}>
        <Ionicons name={icon} size={16} color={faculty.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HERO IMAGE */}
        <ImageBackground source={{ uri: course.image }} style={styles.hero}>
          <View style={styles.heroOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.heroPlayBtn} onPress={() => setShowVideo(true)}>
              <View style={[styles.playCircle, { backgroundColor: faculty.color }]}>
                <Ionicons name="play" size={28} color="#fff" />
              </View>
              <Text style={styles.heroPlayText}>Watch Introduction Video</Text>
            </TouchableOpacity>

            <View style={[styles.levelBadge, { backgroundColor: faculty.color }]}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
            <Text style={styles.courseName}>{course.name}</Text>
            <View style={styles.heroBadges}>
              <View style={styles.heroBadge}>
                <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroBadgeText}>{course.duration}</Text>
              </View>
              <View style={styles.heroBadge}>
                <Ionicons name="school-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroBadgeText}>{faculty.shortName}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* VIDEO MODAL */}
        <Modal
          visible={showVideo}
          animationType="slide"
          onRequestClose={() => setShowVideo(false)}
        >
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={1}>{course.name}</Text>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setShowVideo(false)}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* YouTube Player */}
            <YouTubePlayer
              youtubeId={course.youtubeId}
              style={styles.player}
            />

            {/* Footer */}
            <View style={styles.modalFooter}>
              <Ionicons name="logo-youtube" size={18} color="#FF0000" />
              <Text style={styles.modalFooterText} numberOfLines={2}>
                {course.videoDescription}
              </Text>
            </View>
          </View>
        </Modal>

        {/* RATING CARD */}
        <Animated.View style={[styles.ratingCard, { transform: [{ scale: rateAnim }] }]}>
          <View>
            <Text style={styles.ratingTitle}>Rate This Course</Text>
            <Text style={styles.ratingHint}>
              {rating === 0
                ? 'Tap stars or + button to rate'
                : rating === 6
                ? '🏆 Maximum rating reached!'
                : `Current rating: ${rating}/6`}
            </Text>
          </View>
          <View style={styles.ratingRight}>
            <RatingStars
              rating={rating}
              onRate={(newRating) => updateRating(courseId, newRating)}
              size={26}
              showLabel={false}
            />
            <TouchableOpacity
              style={[styles.addRateBtn, { backgroundColor: rating >= 6 ? COLORS.lightGray : faculty.color }]}
              onPress={handleRatePress}
              disabled={rating >= 6}
            >
              <Ionicons name="add" size={20} color={rating >= 6 ? COLORS.gray : '#fff'} />
              <Text style={[styles.addRateBtnText, { color: rating >= 6 ? COLORS.gray : '#fff' }]}>
                Rate +1
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.body}>

          {/* VIDEO BUTTON */}
          <TouchableOpacity
            style={[styles.videoBtn, { borderColor: faculty.color }]}
            onPress={() => setShowVideo(true)}
          >
            <View style={[styles.videoIcon, { backgroundColor: '#FF0000' }]}>
              <Ionicons name="logo-youtube" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.videoBtnTitle}>Watch Course Introduction</Text>
              <Text style={styles.videoBtnSub} numberOfLines={2}>
                {course.videoDescription}
              </Text>
            </View>
            <Ionicons name="play-circle" size={28} color={faculty.color} />
          </TouchableOpacity>

          {/* DESCRIPTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Course</Text>
            <Text style={styles.description}>{course.description}</Text>
          </View>

          {/* INFO GRID */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Programme Details</Text>
            <View style={styles.infoGrid}>
              <InfoRow icon="school-outline" label="Level" value={course.level} />
              <InfoRow icon="time-outline" label="Duration" value={course.duration} />
              <InfoRow icon="ribbon-outline" label="Entry Requirements" value={course.entryRequirements} />
            </View>
          </View>

          {/* CAREERS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Career Pathways</Text>
            <View style={styles.careersGrid}>
              {course.careers.map((career, i) => (
                <View key={i} style={[styles.careerBadge, { backgroundColor: faculty.color + '18' }]}>
                  <Ionicons name="briefcase-outline" size={13} color={faculty.color} style={{ marginRight: 5 }} />
                  <Text style={[styles.careerText, { color: faculty.color }]}>{career}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* APPLY */}
          <TouchableOpacity
            style={[styles.applyBtn, { backgroundColor: faculty.color }]}
            onPress={() =>
              navigation.navigate('Enrol', { courseName: course.name })
            }
          >
            <Ionicons name="school" size={20} color="#fff" />
            <Text style={styles.applyBtnText}>Apply / Enrol Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F8' },
  hero: { height: 300 },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  heroPlayBtn: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
  },
  playCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroPlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  levelText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  courseName: { color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 28, marginBottom: 10 },
  heroBadges: { flexDirection: 'row', gap: 10 },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  heroBadgeText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },

  // Modal
  modalContainer: { flex: 1, backgroundColor: '#000' },
  modalHeader: {
    backgroundColor: '#0A1628',
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: { flex: 1, color: '#fff', fontWeight: '700', fontSize: 15 },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  player: { flex: 1 },
  modalFooter: {
    backgroundColor: '#0A1628',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalFooterText: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 17 },

  // Rating
  ratingCard: {
    marginHorizontal: 16,
    marginTop: -22,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
  },
  ratingTitle: { fontWeight: '800', fontSize: 15, color: '#1A202C' },
  ratingHint: { fontSize: 11, color: '#718096', marginTop: 3 },
  ratingRight: { alignItems: 'flex-end', gap: 8 },
  addRateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addRateBtnText: { fontWeight: '700', fontSize: 13 },
  body: { padding: 16 },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  videoIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  videoBtnTitle: { fontWeight: '700', fontSize: 14, color: '#1A202C' },
  videoBtnSub: { fontSize: 11, color: '#718096', marginTop: 2, lineHeight: 15 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A202C', marginBottom: 12 },
  description: { fontSize: 14, color: '#4A5568', lineHeight: 22 },
  infoGrid: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
    gap: 12,
  },
  infoIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  infoLabel: { fontSize: 11, color: '#718096', marginBottom: 2 },
  infoValue: { fontSize: 13, color: '#1A202C', fontWeight: '600', lineHeight: 18 },
  careersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  careerBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  careerText: { fontSize: 12, fontWeight: '600' },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default CourseDetailScreen;