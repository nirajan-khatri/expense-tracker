import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '@/store/useExpenseStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const CATEGORY_ICONS: Record<string, string> = {
  food: 'fast-food',
  groceries: 'cart',
  entertainment: 'game-controller',
  transport: 'car',
  shopping: 'bag-handle',
  'scanned receipt': 'scan',
  general: 'wallet',
};

function getCategoryIcon(category: string): string {
  const key = category.toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(keyword)) return icon;
  }
  return 'wallet-outline';
}

const CATEGORY_COLORS = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];

function getCategoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

export default function HomeScreen() {
  const { expenses, totalBalance } = useExpenseStore();
  const router = useRouter();
  const balance = totalBalance();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      {/* Header Card */}
      <View className="mx-5 mt-4 rounded-3xl overflow-hidden">
        <LinearGradient
          colors={['#065f46', '#064e3b', '#022c22']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 28, borderRadius: 24 }}
        >
          <Text className="text-emerald-200/70 text-sm font-semibold tracking-widest uppercase">
            Total Spent
          </Text>
          <Text className="text-white text-[42px] font-bold tracking-tight mt-2">
            ${balance.toFixed(2)}
          </Text>
          <View className="flex-row mt-5 gap-3">
            <TouchableOpacity
              onPress={() => router.push('/add-expense')}
              className="flex-row items-center bg-white/15 px-4 py-2.5 rounded-xl"
            >
              <Ionicons name="add-circle" size={18} color="#34d399" />
              <Text className="text-white font-semibold ml-2 text-sm">Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/analytics')}
              className="flex-row items-center bg-white/15 px-4 py-2.5 rounded-xl"
            >
              <Ionicons name="pie-chart" size={16} color="#34d399" />
              <Text className="text-white font-semibold ml-2 text-sm">Analytics</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Transactions Section */}
      <View className="flex-1 mt-6 px-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-lg font-bold">Recent Transactions</Text>
          <Text className="text-zinc-500 text-sm">{expenses.length} total</Text>
        </View>

        {expenses.length === 0 ? (
          <View className="flex-1 justify-center items-center pb-24">
            <View className="w-20 h-20 bg-zinc-800/60 rounded-full items-center justify-center mb-5">
              <Ionicons name="receipt-outline" size={36} color="#3f3f46" />
            </View>
            <Text className="text-zinc-400 text-base font-semibold">No expenses yet</Text>
            <Text className="text-zinc-600 text-sm mt-1 text-center px-8">
              Tap the + button above or scan a receipt to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={expenses.slice().reverse()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const iconColor = getCategoryColor(item.category);
              return (
                <Pressable className="flex-row justify-between items-center bg-zinc-900/80 border border-zinc-800/50 p-4 rounded-2xl mb-2.5">
                  <View className="flex-row items-center flex-1 mr-4">
                    <View
                      className="w-11 h-11 rounded-xl items-center justify-center mr-3.5"
                      style={{ backgroundColor: iconColor + '20' }}
                    >
                      <Ionicons
                        name={getCategoryIcon(item.category) as any}
                        size={20}
                        color={iconColor}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-[15px]" numberOfLines={1}>
                        {item.category || item.note || 'Expense'}
                      </Text>
                      <Text className="text-zinc-500 text-xs mt-0.5">
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-red-400 font-bold text-base">
                    -${item.amount.toFixed(2)}
                  </Text>
                </Pressable>
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/add-expense')}
        activeOpacity={0.8}
        className="absolute bottom-28 right-6 w-14 h-14 rounded-2xl items-center justify-center"
        style={{
          backgroundColor: '#10b981',
          shadowColor: '#10b981',
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
