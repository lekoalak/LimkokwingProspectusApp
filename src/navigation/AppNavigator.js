// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FacultiesScreen from '../screens/FacultiesScreen';
import FacultyDetailScreen from '../screens/FacultyDetailScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import RatingsScreen from '../screens/RatingsScreen';
import EnrolScreen from '../screens/EnrolScreen';
import { COLORS } from '../theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Enrol" component={EnrolScreen} />
  </Stack.Navigator>
);

const FacultiesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FacultiesMain" component={FacultiesScreen} />
    <Stack.Screen name="FacultyDetail" component={FacultyDetailScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Enrol" component={EnrolScreen} />
  </Stack.Navigator>
);

const RatingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RatingsMain" component={RatingsScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Enrol" component={EnrolScreen} />
  </Stack.Navigator>
);

const QuizStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="QuizMain" component={QuizScreen} />
    <Stack.Screen name="FacultyDetail" component={FacultyDetailScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Enrol" component={EnrolScreen} />
  </Stack.Navigator>
);

const EnrolStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="EnrolMain" component={EnrolScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.primary,
        borderTopColor: 'rgba(255,255,255,0.08)',
        height: 68,
        paddingBottom: 10,
        paddingTop: 8,
      },
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      tabBarLabelStyle: { fontSize: 10, fontWeight: '700', marginTop: 2 },
      tabBarIcon: ({ focused, color }) => {
        const icons = {
          Home: focused ? 'home' : 'home-outline',
          Faculties: focused ? 'school' : 'school-outline',
          Quiz: focused ? 'help-circle' : 'help-circle-outline',
          Ratings: focused ? 'star' : 'star-outline',
          Apply: focused ? 'create' : 'create-outline',
        };
        return <Ionicons name={icons[route.name]} size={22} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Faculties" component={FacultiesStack} />
    <Tab.Screen name="Quiz" component={QuizStack} />
    <Tab.Screen name="Ratings" component={RatingsStack} />
    <Tab.Screen name="Apply" component={EnrolStack} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);

export default AppNavigator;