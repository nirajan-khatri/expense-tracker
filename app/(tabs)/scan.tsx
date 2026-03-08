import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '@/store/useExpenseStore';

export default function ScanScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const router = useRouter();
  const addExpense = useExpenseStore((state) => state.addExpense);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePhoto = async () => {
    if (camera.current) {
      setIsProcessing(true);
      try {
        const photo = await camera.current.takePhoto({
          flash: 'off',
        });

        // Simulating OCR parsing delay
        setTimeout(() => {
          setIsProcessing(false);
          const randomAmount = parseFloat((Math.random() * 50 + 10).toFixed(2));

          addExpense({
            amount: randomAmount,
            category: 'Scanned Receipt',
            note: 'Auto-extracted from receipt',
            date: new Date().toISOString(),
          });

          router.push('/');
        }, 2000);
      } catch (e) {
        console.error(e);
        setIsProcessing(false);
      }
    }
  };

  if (!hasPermission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
        <View className="flex-1 items-center justify-center p-8">
          <View className="w-24 h-24 bg-zinc-800/60 rounded-full items-center justify-center mb-6">
            <Ionicons name="camera-outline" size={48} color="#3f3f46" />
          </View>
          <Text className="text-white text-xl font-bold text-center">Camera Access Required</Text>
          <Text className="text-zinc-500 text-center mt-2 mb-8 leading-5">
            We need camera access to scan your receipts and automatically extract the total amounts.
          </Text>
          <TouchableOpacity
            className="bg-emerald-500 py-3.5 px-8 rounded-xl w-full items-center"
            onPress={requestPermission}
            style={{
              shadowColor: '#10b981',
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
            }}
          >
            <Text className="text-white font-bold text-base">Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (device == null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <View className="w-20 h-20 bg-zinc-800/60 rounded-full items-center justify-center mb-5">
            <Ionicons name="videocam-off-outline" size={36} color="#3f3f46" />
          </View>
          <Text className="text-zinc-400 font-semibold">No Camera Found</Text>
          <Text className="text-zinc-600 text-sm mt-1">This device has no camera hardware</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!isProcessing}
        photo={true}
      />

      {/* Top Bar */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, width: '100%' }}>
        <View className="px-5 pt-2 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-xl font-bold tracking-wide">Smart Scan</Text>
            <Text className="text-zinc-400 text-xs mt-0.5">Point at a receipt</Text>
          </View>
          <View className="w-10 h-10 bg-black/50 rounded-xl items-center justify-center">
            <Ionicons name="flash-off" size={18} color="white" />
          </View>
        </View>
      </SafeAreaView>

      {/* Viewfinder */}
      <View
        style={{
          position: 'absolute',
          top: '25%',
          left: '10%',
          right: '10%',
          bottom: '35%',
          borderWidth: 2,
          borderColor: 'rgba(52, 211, 153, 0.4)',
          borderRadius: 16,
          backgroundColor: 'rgba(52, 211, 153, 0.04)',
        }}
      />

      {/* Bottom Controls */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          paddingBottom: 50,
          paddingTop: 24,
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        {isProcessing ? (
          <View className="items-center">
            <View className="w-20 h-20 bg-zinc-900 rounded-full items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#34d399" />
            </View>
            <Text className="text-emerald-400 font-bold text-base">Extracting Total...</Text>
            <Text className="text-zinc-500 text-sm mt-1">Running Vision AI</Text>
          </View>
        ) : (
          <View className="items-center">
            <TouchableOpacity
              onPress={takePhoto}
              activeOpacity={0.7}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                borderWidth: 4,
                borderColor: 'rgba(52, 211, 153, 0.7)',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#10b981',
                shadowOpacity: 0.4,
                shadowRadius: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: '#fff',
                }}
              />
            </TouchableOpacity>
            <Text className="text-zinc-400 mt-5 text-sm font-medium">
              Align receipt inside the frame
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
