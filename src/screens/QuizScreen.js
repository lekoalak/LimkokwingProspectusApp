// src/screens/QuizScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';
import { QUIZ_QUESTIONS, FACULTIES } from '../data/faculties';

const QuizScreen = ({ navigation }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  const progress = (currentQ / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (option) => {
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);

    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      // Fade transition
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentQ(currentQ + 1);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
    } else {
      // Compute results
      const facultyScores = {};
      newAnswers.forEach((ans) => {
        ans.faculties.forEach((f) => {
          facultyScores[f] = (facultyScores[f] || 0) + 1;
        });
      });

      const sorted = Object.entries(facultyScores).sort((a, b) => b[1] - a[1]);
      const topFacultyId = sorted[0]?.[0];
      const topFaculty = FACULTIES.find((f) => f.id === topFacultyId);
      setResults({ topFaculty, scores: sorted });
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAnswers([]);
    setFinished(false);
    setResults(null);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  if (finished && results) {
    const { topFaculty, scores } = results;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Results</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.resultContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultHero}>
            <Text style={styles.resultEmoji}>🎓</Text>
            <Text style={styles.resultTitle}>Your Best Match</Text>
            {topFaculty && (
              <>
                <View style={[styles.resultFacultyBadge, { backgroundColor: topFaculty.color }]}>
                  <Ionicons name={topFaculty.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.resultFacultyName}>{topFaculty.name}</Text>
                <Text style={styles.resultFacultyDesc}>{topFaculty.description}</Text>
              </>
            )}
          </View>

          {/* Score breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Score Breakdown</Text>
            {scores.map(([fId, score]) => {
              const fac = FACULTIES.find((f) => f.id === fId);
              if (!fac) return null;
              const pct = (score / QUIZ_QUESTIONS.length) * 100;
              return (
                <View key={fId} style={styles.breakdownRow}>
                  <View style={[styles.breakdownIcon, { backgroundColor: fac.color + '22' }]}>
                    <Ionicons name={fac.icon} size={14} color={fac.color} />
                  </View>
                  <Text style={styles.breakdownName} numberOfLines={1}>
                    {fac.shortName}
                  </Text>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${pct}%`, backgroundColor: fac.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownScore}>{score}</Text>
                </View>
              );
            })}
          </View>

          {topFaculty && (
            <TouchableOpacity
              style={[styles.exploreFacultyBtn, { backgroundColor: topFaculty.color }]}
              onPress={() => {
                navigation.navigate('Faculties');
                setTimeout(() => {
                  navigation.navigate('FacultyDetail', { facultyId: topFaculty.id });
                }, 200);
              }}
            >
              <Ionicons name="school" size={18} color="#fff" />
              <Text style={styles.exploreFacultyBtnText}>
                Explore {topFaculty.shortName} Courses
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.retakeBtn} onPress={resetQuiz}>
            <Ionicons name="refresh" size={16} color={COLORS.primary} />
            <Text style={styles.retakeBtnText}>Retake Quiz</Text>
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Ionicons name="close" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Career Quiz</Text>
        <Text style={styles.headerCount}>
          {currentQ + 1}/{QUIZ_QUESTIONS.length}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Animated.View style={[styles.quizBody, { opacity: fadeAnim }]}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Question {currentQ + 1}</Text>
          <Text style={styles.questionText}>{q.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {q.options.map((option, i) => (
            <TouchableOpacity
              key={i}
              style={styles.optionBtn}
              onPress={() => handleAnswer(option)}
              activeOpacity={0.8}
            >
              <View style={styles.optionLetter}>
                <Text style={styles.optionLetterText}>
                  {String.fromCharCode(65 + i)}
                </Text>
              </View>
              <Text style={styles.optionText}>{option.text}</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.lightGray} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  headerCount: { color: COLORS.accent, fontWeight: '700', fontSize: 14 },
  progressContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBg: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  quizBody: { flex: 1, padding: 20 },
  questionContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  questionNumber: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 28,
  },
  optionsContainer: { gap: 10 },
  optionBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.small,
  },
  optionLetter: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.screenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: { fontWeight: '800', fontSize: 14, color: COLORS.primary },
  optionText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 19 },
  // Results styles
  resultContainer: { padding: 20 },
  resultHero: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.large,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  resultEmoji: { fontSize: 40, marginBottom: 8 },
  resultTitle: { color: COLORS.accent, fontWeight: '800', fontSize: 13, letterSpacing: 1, marginBottom: 16 },
  resultFacultyBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  resultFacultyName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultFacultyDesc: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    ...SHADOWS.small,
  },
  breakdownTitle: { fontWeight: '800', fontSize: 15, color: COLORS.text, marginBottom: 14 },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  breakdownIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownName: { width: 58, fontSize: 12, fontWeight: '600', color: COLORS.text },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  breakdownScore: { width: 16, fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  exploreFacultyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 15,
    gap: 10,
    marginBottom: 12,
    ...SHADOWS.medium,
  },
  exploreFacultyBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  retakeBtnText: { color: COLORS.primary, fontSize: 14, fontWeight: '700' },
});

export default QuizScreen;
