// src/components/RatingStars.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const MAX_RATING = 6;

const RatingStars = ({ rating, onRate, size = 28, showLabel = true }) => {
  const scaleAnims = React.useRef(
    Array.from({ length: MAX_RATING }, () => new Animated.Value(1))
  ).current;

  const handlePress = (starIndex) => {
    const newRating = starIndex + 1;
    if (newRating <= MAX_RATING) {
      // Bounce animation
      Animated.sequence([
        Animated.timing(scaleAnims[starIndex], {
          toValue: 1.4,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnims[starIndex], {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
      onRate(newRating);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsRow}>
        {Array.from({ length: MAX_RATING }, (_, i) => (
          <Animated.View
            key={i}
            style={{ transform: [{ scale: scaleAnims[i] }] }}
          >
            <TouchableOpacity
              onPress={() => handlePress(i)}
              activeOpacity={0.7}
              style={styles.starBtn}
            >
              <Ionicons
                name={i < rating ? 'star' : 'star-outline'}
                size={size}
                color={i < rating ? COLORS.accent : COLORS.lightGray}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      {showLabel && (
        <Text style={styles.ratingText}>
          {rating === 0
            ? 'Tap to rate'
            : rating === MAX_RATING
            ? '🏆 Max Rating!'
            : `${rating}/${MAX_RATING}`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starBtn: {
    padding: 3,
  },
  ratingText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
});

export default RatingStars;
