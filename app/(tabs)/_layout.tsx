import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#34d399',
        tabBarInactiveTintColor: '#71717a',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: 'rgba(9, 9, 11, 0.85)',
            borderTopWidth: 0,
            height: 88,
            paddingBottom: 28,
            paddingTop: 8,
          },
          default: {
            backgroundColor: '#09090b',
            borderTopWidth: 0,
            elevation: 0,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={focused ? 26 : 22} name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={focused ? 26 : 22} name={focused ? 'scan' : 'scan-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={focused ? 26 : 22} name={focused ? 'pie-chart' : 'pie-chart-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
