import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const CATEGORIES = ['Groceries', 'Food', 'Transport', 'Shopping', 'Entertainment', 'General'];

export default function AddExpenseScreen() {
  const router = useRouter();
  const addExpense = useExpenseStore((state) => state.addExpense);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addExpense({
      amount: parseFloat(amount),
      category: category || 'General',
      note,
      date: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Header */}
        <View className="px-5 flex-row items-center justify-between pt-2 pb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-zinc-800 rounded-xl items-center justify-center"
          >
            <Ionicons name="close" size={22} color="#a1a1aa" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">New Expense</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Amount Input */}
          <View className="items-center justify-center py-10">
            <Text className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-3">Amount</Text>
            <View className="flex-row items-baseline">
              <Text className="text-emerald-400 text-5xl font-bold">$</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#3f3f46"
                className="text-white text-5xl font-bold tracking-tight min-w-[120px] ml-1"
                autoFocus
              />
            </View>
          </View>

          {/* Category Chips */}
          <View className="px-5 mb-6">
            <Text className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-3">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  className={`px-4 py-2.5 rounded-xl border ${
                    category === cat
                      ? 'bg-emerald-500/15 border-emerald-500/40'
                      : 'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      category === cat ? 'text-emerald-400' : 'text-zinc-400'
                    }`}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Note Input */}
          <View className="px-5 mb-6">
            <Text className="text-zinc-500 text-sm font-semibold tracking-widest uppercase mb-3">Note</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="What was this for?"
              placeholderTextColor="#3f3f46"
              className="bg-zinc-900 border border-zinc-800 text-white p-4 rounded-xl text-base"
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="px-5 pb-10 pt-3">
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={!amount}
            className={`py-4 rounded-2xl items-center ${amount ? 'bg-emerald-500' : 'bg-zinc-800'}`}
            style={
              amount
                ? {
                    shadowColor: '#10b981',
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 4 },
                  }
                : undefined
            }
          >
            <Text className={`text-lg font-bold ${amount ? 'text-white' : 'text-zinc-600'}`}>
              Save Expense
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
