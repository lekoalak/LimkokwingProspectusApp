// src/components/FacultyCard.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

const FacultyCard = ({ faculty, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true, friction: 8 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.card}
      >
        <ImageBackground
          source={{ uri: faculty.image }}
          style={styles.bg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.overlay}>
            <View style={[styles.iconBg, { backgroundColor: faculty.color }]}>
              <Ionicons name={faculty.icon} size={24} color="#fff" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{faculty.shortName}</Text>
              <Text style={styles.courses}>{faculty.courses.length} Courses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
    ...SHADOWS.medium,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 100,
  },
  bg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bgImage: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  iconBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  courses: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
  },
});

export default FacultyCard;
