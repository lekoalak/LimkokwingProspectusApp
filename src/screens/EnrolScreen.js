// src/screens/EnrolScreen.js
import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  TextInput, StatusBar, Animated, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../theme/colors';

const ALL_COURSES = [
  { name: 'Diploma in Creative Advertising', faculty: 'Design Innovation' },
  { name: 'Diploma in Graphic Design', faculty: 'Design Innovation' },
  { name: 'Diploma in Fashion and Apparel Design', faculty: 'Design Innovation' },
  { name: 'Diploma in Interior Design', faculty: 'Design Innovation' },
  { name: 'Diploma in Digital Animation', faculty: 'Design Innovation' },
  { name: 'Degree in Professional Communication', faculty: 'Media & Broadcasting' },
  { name: 'Degree in Broadcasting & Journalism', faculty: 'Media & Broadcasting' },
  { name: 'Diploma in Television and Film Production', faculty: 'Media & Broadcasting' },
  { name: 'Diploma in Public Relations', faculty: 'Media & Broadcasting' },
  { name: 'Diploma in Journalism and Media', faculty: 'Media & Broadcasting' },
  { name: 'Diploma in Architectural Technology', faculty: 'Architecture' },
  { name: 'Diploma in Construction Management', faculty: 'Architecture' },
  { name: 'Diploma in Urban Planning', faculty: 'Architecture' },
  { name: 'Diploma in Quantity Surveying', faculty: 'Architecture' },
  { name: 'Diploma in Interior Architecture', faculty: 'Architecture' },
  { name: 'Degree in International Business', faculty: 'Business & Globalization' },
  { name: 'Degree in Entrepreneurship', faculty: 'Business & Globalization' },
  { name: 'Degree in Human Resource Management', faculty: 'Business & Globalization' },
  { name: 'Diploma in Business Management', faculty: 'Business & Globalization' },
  { name: 'Diploma in Marketing', faculty: 'Business & Globalization' },
  { name: 'Degree in Software Engineering with Multimedia', faculty: 'ICT' },
  { name: 'Degree in Business Information Technology', faculty: 'ICT' },
  { name: 'Degree in Information Technology', faculty: 'ICT' },
  { name: 'Diploma in Multimedia and Software Engineering', faculty: 'ICT' },
  { name: 'Diploma in Information Technology', faculty: 'ICT' },
];

const GENDER_OPTIONS = ['Male', 'Female', 'Prefer not to say'];
const INTAKE_OPTIONS = ['January 2025', 'May 2025', 'September 2025', 'January 2026'];
const STEPS = ['Personal Info', 'Programme', 'Statement'];

const EnrolScreen = ({ route, navigation }) => {
  const preselected = route?.params?.courseName || '';
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    gender: '', dob: '', nationality: '', idNumber: '', address: '',
    selectedCourse: preselected, intake: '',
    highSchool: '', grade12Results: '',
    motivation: '', hearAboutUs: '', agreeTerms: false,
  });

  const set = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!form.firstName.trim()) e.firstName = 'Required';
      if (!form.lastName.trim()) e.lastName = 'Required';
      if (!form.email.trim()) e.email = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.phone.trim()) e.phone = 'Required';
      if (!form.gender) e.gender = 'Please select';
      if (!form.dob.trim()) e.dob = 'Required';
      if (!form.nationality.trim()) e.nationality = 'Required';
    }
    if (step === 2) {
      if (!form.selectedCourse) e.selectedCourse = 'Please select a course';
      if (!form.intake) e.intake = 'Please select an intake';
      if (!form.highSchool.trim()) e.highSchool = 'Required';
    }
    if (step === 3) {
      if (!form.motivation.trim()) e.motivation = 'Please write your motivation';
      if (!form.agreeTerms) e.agreeTerms = 'You must agree to proceed';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const animate = (cb) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 130, useNativeDriver: true }).start(() => {
      cb();
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const next = () => { if (validate()) animate(() => setStep(s => s + 1)); };
  const back = () => animate(() => setStep(s => s - 1));
  const submit = () => { if (validate()) setSubmitted(true); };

  // ─── Input ───────────────────────────────────────────
  const Field = ({ label, value, onChange, placeholder, error, keyboard, multiline, icon }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error && { borderColor: COLORS.error }]}>
        {icon && <Ionicons name={icon} size={15} color={COLORS.gray} style={{ marginRight: 8 }} />}
        <TextInput
          style={[styles.input, multiline && styles.inputMulti]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          keyboardType={keyboard || 'default'}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
        />
      </View>
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );

  // ─── Chip select ─────────────────────────────────────
  const Chips = ({ label, value, options, onSelect, error }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map(o => (
          <TouchableOpacity
            key={o}
            style={[styles.chip, value === o && styles.chipActive]}
            onPress={() => onSelect(o)}
          >
            <Text style={[styles.chipTxt, value === o && styles.chipTxtActive]}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.err}>{error}</Text> : null}
    </View>
  );

  // ─── Course picker ───────────────────────────────────
  const CoursePicker = () => {
    const faculties = [...new Set(ALL_COURSES.map(c => c.faculty))];
    return (
      <View style={styles.field}>
        <Text style={styles.label}>Select Programme *</Text>
        <ScrollView style={styles.courseScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
          {faculties.map(fac => (
            <View key={fac}>
              <View style={styles.facultyHeader}>
                <Ionicons name="school-outline" size={13} color={COLORS.accent} />
                <Text style={styles.facultyName}>{fac}</Text>
              </View>
              {ALL_COURSES.filter(c => c.faculty === fac).map(c => (
                <TouchableOpacity
                  key={c.name}
                  style={[styles.courseRow, form.selectedCourse === c.name && styles.courseRowActive]}
                  onPress={() => set('selectedCourse', c.name)}
                >
                  <Ionicons
                    name={form.selectedCourse === c.name ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={form.selectedCourse === c.name ? COLORS.accent : COLORS.gray}
                  />
                  <Text style={[styles.courseTxt, form.selectedCourse === c.name && styles.courseTxtActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
        {errors.selectedCourse ? <Text style={styles.err}>{errors.selectedCourse}</Text> : null}
      </View>
    );
  };

  // ─── SUCCESS ─────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.successBg}>
        <StatusBar barStyle="light-content" />
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          <Text style={styles.successTitle}>Application Submitted! 🎉</Text>
          <Text style={styles.successSub}>Thank you, {form.firstName}!</Text>

          <View style={styles.successBadge}>
            <Text style={styles.successBadgeTxt}>{form.selectedCourse}</Text>
          </View>

          <View style={styles.successInfo}>
            {[
              { icon: 'mail-outline', text: `Confirmation email sent to ${form.email}` },
              { icon: 'call-outline', text: 'Our team will contact you within 3–5 business days' },
              { icon: 'calendar-outline', text: `Intake: ${form.intake}` },
            ].map((item, i) => (
              <View key={i} style={styles.successRow}>
                <Ionicons name={item.icon} size={15} color={COLORS.accent} />
                <Text style={styles.successRowTxt}>{item.text}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.successContact}>
            📞 +266 2231 5767  ·  Toll-free: 80022066{'\n'}🌐 www.limkokwing.ac.ls
          </Text>

          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Ionicons name="home" size={18} color={COLORS.primary} />
            <Text style={styles.homeBtnTxt}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ─── MAIN FORM ───────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>Apply / Enrol</Text>
            <Text style={styles.headerSub}>Limkokwing University of Creative Technology</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Steps */}
        <View style={styles.stepsBar}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, i + 1 <= step ? styles.stepDotOn : styles.stepDotOff]}>
                  {i + 1 < step
                    ? <Ionicons name="checkmark" size={13} color="#fff" />
                    : <Text style={styles.stepNum}>{i + 1}</Text>
                  }
                </View>
                <Text style={[styles.stepLbl, i + 1 === step && styles.stepLblOn]}>{s}</Text>
              </View>
              {i < STEPS.length - 1 && (
                <View style={[styles.stepLine, i + 1 < step && styles.stepLineOn]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Form body */}
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <View style={styles.stepHead}>
                  <Ionicons name="person-circle" size={26} color={COLORS.accent} />
                  <View>
                    <Text style={styles.stepHeadTitle}>Personal Information</Text>
                    <Text style={styles.stepHeadSub}>Fill in your personal details</Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Field label="First Name *" value={form.firstName} onChange={v => set('firstName', v)}
                      placeholder="Thabo" error={errors.firstName} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Field label="Last Name *" value={form.lastName} onChange={v => set('lastName', v)}
                      placeholder="Mokoena" error={errors.lastName} />
                  </View>
                </View>

                <Field label="Email Address *" value={form.email} onChange={v => set('email', v)}
                  placeholder="you@email.com" error={errors.email} keyboard="email-address" icon="mail-outline" />

                <Field label="Phone Number *" value={form.phone} onChange={v => set('phone', v)}
                  placeholder="+266 5000 0000" error={errors.phone} keyboard="phone-pad" icon="call-outline" />

                <Chips label="Gender *" value={form.gender} options={GENDER_OPTIONS}
                  onSelect={v => set('gender', v)} error={errors.gender} />

                <Field label="Date of Birth *" value={form.dob} onChange={v => set('dob', v)}
                  placeholder="DD/MM/YYYY" error={errors.dob} icon="calendar-outline" />

                <Field label="Nationality *" value={form.nationality} onChange={v => set('nationality', v)}
                  placeholder="e.g. Mosotho" error={errors.nationality} icon="globe-outline" />

                <Field label="ID / Passport Number" value={form.idNumber} onChange={v => set('idNumber', v)}
                  placeholder="e.g. 123456789" icon="card-outline" />

                <Field label="Home Address" value={form.address} onChange={v => set('address', v)}
                  placeholder="Street, City, Country" icon="location-outline" />
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <View style={styles.stepHead}>
                  <Ionicons name="school" size={26} color={COLORS.accent} />
                  <View>
                    <Text style={styles.stepHeadTitle}>Programme & Qualifications</Text>
                    <Text style={styles.stepHeadSub}>Choose your course and enter your results</Text>
                  </View>
                </View>

                <CoursePicker />

                <Chips label="Preferred Intake *" value={form.intake} options={INTAKE_OPTIONS}
                  onSelect={v => set('intake', v)} error={errors.intake} />

                <Field label="High School / Last School Attended *" value={form.highSchool}
                  onChange={v => set('highSchool', v)} placeholder="e.g. Machabeng College"
                  error={errors.highSchool} icon="business-outline" />

                <Field label="Grade 12 / COSC Results" value={form.grade12Results}
                  onChange={v => set('grade12Results', v)}
                  placeholder="e.g. English C, Maths C, Science D..."
                  multiline icon="document-text-outline" />
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <View style={styles.stepHead}>
                  <Ionicons name="create" size={26} color={COLORS.accent} />
                  <View>
                    <Text style={styles.stepHeadTitle}>Motivation Statement</Text>
                    <Text style={styles.stepHeadSub}>Tell us why you want to join us</Text>
                  </View>
                </View>

                <Field
                  label="Why do you want to study this course? *"
                  value={form.motivation} onChange={v => set('motivation', v)}
                  placeholder="Describe your passion, goals and what you hope to achieve..."
                  error={errors.motivation} multiline
                />

                <Field label="How did you hear about Limkokwing?" value={form.hearAboutUs}
                  onChange={v => set('hearAboutUs', v)}
                  placeholder="e.g. Social media, friend, newspaper..." icon="megaphone-outline" />

                {/* Summary */}
                <View style={styles.summary}>
                  <Text style={styles.summaryTitle}>📋 Application Summary</Text>
                  {[
                    { k: 'Name', v: `${form.firstName} ${form.lastName}` },
                    { k: 'Email', v: form.email },
                    { k: 'Phone', v: form.phone },
                    { k: 'Programme', v: form.selectedCourse || '—' },
                    { k: 'Intake', v: form.intake || '—' },
                  ].map(({ k, v }) => (
                    <View key={k} style={styles.summaryRow}>
                      <Text style={styles.summaryK}>{k}</Text>
                      <Text style={styles.summaryV} numberOfLines={2}>{v}</Text>
                    </View>
                  ))}
                </View>

                {/* Terms */}
                <TouchableOpacity style={styles.termsRow} onPress={() => set('agreeTerms', !form.agreeTerms)}>
                  <View style={[styles.checkbox, form.agreeTerms && styles.checkboxOn]}>
                    {form.agreeTerms && <Ionicons name="checkmark" size={13} color="#fff" />}
                  </View>
                  <Text style={styles.termsTxt}>
                    I confirm all information is accurate and agree to the{' '}
                    <Text style={{ color: COLORS.accent, fontWeight: '700' }}>Terms & Conditions</Text>
                    {' '}of Limkokwing University.
                  </Text>
                </TouchableOpacity>
                {errors.agreeTerms ? <Text style={styles.err}>{errors.agreeTerms}</Text> : null}
              </>
            )}

          </Animated.View>
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom nav */}
        <View style={styles.bottomNav}>
          {step > 1 && (
            <TouchableOpacity style={styles.backNavBtn} onPress={back}>
              <Ionicons name="arrow-back" size={16} color={COLORS.primary} />
              <Text style={styles.backNavTxt}>Back</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          {step < STEPS.length ? (
            <TouchableOpacity style={styles.nextBtn} onPress={next}>
              <Text style={styles.nextTxt}>Next Step</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitBtn} onPress={submit}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.submitTxt}>Submit Application</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.screenBg },

  header: {
    backgroundColor: COLORS.primary, paddingTop: 54, paddingBottom: 16,
    paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  headerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 2 },

  stepsBar: {
    backgroundColor: COLORS.primary, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center',
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepDotOn: { backgroundColor: COLORS.accent },
  stepDotOff: { backgroundColor: 'rgba(255,255,255,0.2)' },
  stepNum: { color: '#fff', fontSize: 12, fontWeight: '700' },
  stepLbl: { color: 'rgba(255,255,255,0.45)', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  stepLblOn: { color: COLORS.accent, fontWeight: '800' },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 12 },
  stepLineOn: { backgroundColor: COLORS.accent },

  body: { padding: 16 },
  row: { flexDirection: 'row', gap: 10 },

  stepHead: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, marginBottom: 18,
  },
  stepHeadTitle: { color: '#fff', fontSize: 15, fontWeight: '800' },
  stepHeadSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 2 },

  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 13, paddingVertical: 11,
    borderWidth: 1.5, borderColor: COLORS.lightGray,
  },
  input: { flex: 1, fontSize: 14, color: COLORS.text },
  inputMulti: { height: 90, textAlignVertical: 'top' },
  err: { color: COLORS.error, fontSize: 10, marginTop: 3, marginLeft: 2 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.lightGray, backgroundColor: '#fff',
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipTxt: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  chipTxtActive: { color: '#fff' },

  courseScroll: {
    maxHeight: 300, backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.lightGray,
  },
  facultyHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary + 'EE', paddingHorizontal: 12, paddingVertical: 7,
  },
  facultyName: { color: COLORS.accent, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  courseRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
  },
  courseRowActive: { backgroundColor: COLORS.accent + '15' },
  courseTxt: { flex: 1, fontSize: 13, color: COLORS.text },
  courseTxtActive: { color: COLORS.primary, fontWeight: '700' },

  summary: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: COLORS.lightGray, ...SHADOWS.small,
  },
  summaryTitle: { fontWeight: '800', fontSize: 13, color: COLORS.text, marginBottom: 10 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray,
  },
  summaryK: { fontSize: 12, color: COLORS.textLight, fontWeight: '600', width: 80 },
  summaryV: { fontSize: 12, color: COLORS.text, fontWeight: '700', flex: 1, textAlign: 'right' },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 4 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: COLORS.lightGray, alignItems: 'center', justifyContent: 'center', marginTop: 1,
  },
  checkboxOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  termsTxt: { flex: 1, fontSize: 12, color: COLORS.textLight, lineHeight: 18 },

  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 1, borderTopColor: COLORS.lightGray, ...SHADOWS.medium,
  },
  backNavBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 16, paddingVertical: 11, borderRadius: 20,
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  backNavTxt: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.accent, paddingHorizontal: 22, paddingVertical: 12, borderRadius: 20,
  },
  nextTxt: { color: COLORS.primary, fontWeight: '800', fontSize: 14 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.success, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20,
  },
  submitTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },

  successBg: {
    flex: 1, backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  successCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28,
    alignItems: 'center', width: '100%', maxWidth: 440, ...SHADOWS.large,
  },
  successTitle: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 10, marginBottom: 4 },
  successSub: { fontSize: 13, color: COLORS.textLight, textAlign: 'center' },
  successBadge: {
    backgroundColor: COLORS.primary, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 8, marginVertical: 12,
  },
  successBadgeTxt: { color: COLORS.accent, fontWeight: '800', fontSize: 13, textAlign: 'center' },
  successInfo: {
    backgroundColor: COLORS.screenBg, borderRadius: 14, padding: 14,
    width: '100%', marginTop: 10, gap: 10,
  },
  successRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  successRowTxt: { flex: 1, fontSize: 12, color: COLORS.textLight, lineHeight: 17 },
  successContact: { textAlign: 'center', fontSize: 11, color: COLORS.textLight, marginTop: 14, lineHeight: 19 },
  homeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.accent, paddingHorizontal: 24,
    paddingVertical: 13, borderRadius: 24, marginTop: 18,
  },
  homeBtnTxt: { color: COLORS.primary, fontWeight: '800', fontSize: 15 },
});

export default EnrolScreen;