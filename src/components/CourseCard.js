// src/components/CourseCard.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import RatingStars from './RatingStars';

const CourseCard = ({ course, facultyColor, onPress, onRate }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: course.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={[styles.levelBadge, { backgroundColor: facultyColor }]}>
            <Text style={styles.levelText}>{course.level}</Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={11} color={COLORS.white} />
            <Text style={styles.durationText}>{course.duration}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.courseName} numberOfLines={2}>
            {course.name}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {course.description}
          </Text>

          <View style={styles.footer}>
            <RatingStars
              rating={course.rating}
              onRate={(newRating) => onRate(course.id, newRating)}
              size={20}
              showLabel={false}
            />
            <TouchableOpacity
              style={[styles.detailBtn, { backgroundColor: facultyColor }]}
              onPress={onPress}
            >
              <Text style={styles.detailBtnText}>Details</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  levelBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  durationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  durationText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: 14,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 17,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 4,
  },
  detailBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default CourseCard;
