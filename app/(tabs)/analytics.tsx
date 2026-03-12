import React from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenseStore } from '@/store/useExpenseStore';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsScreen() {
  const expenses = useExpenseStore((state) => state.expenses);
  const totalBalance = useExpenseStore((state) => state.totalBalance);
  const screenWidth = Dimensions.get('window').width;
  const total = totalBalance();

  // Group by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((exp) => {
    const cat = exp.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
  });

  const colors = ['#34d399', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];

  const pieData = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    population: categoryTotals[cat],
    color: colors[index % colors.length],
    legendFontColor: '#a1a1aa',
    legendFontSize: 12,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#18181b',
    backgroundGradientTo: '#18181b',
    color: (opacity = 1) => `rgba(52, 211, 153, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(161, 161, 170, ${opacity})`,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#09090b' }} edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text className="text-white text-2xl font-bold">Analytics</Text>
        <Text className="text-zinc-500 text-sm mt-1">Where your money goes</Text>
      </View>

      <ScrollView className="flex-1 px-5 mt-4" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {expenses.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-32">
            <View className="w-20 h-20 bg-zinc-800/60 rounded-full items-center justify-center mb-5">
              <Ionicons name="pie-chart-outline" size={36} color="#3f3f46" />
            </View>
            <Text className="text-zinc-400 text-base font-semibold">No data yet</Text>
            <Text className="text-zinc-600 text-sm mt-1">Add some expenses to see insights</Text>
          </View>
        ) : (
          <>
            {/* Pie Chart Card */}
            <View className="bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-5 mb-4">
              <Text className="text-white font-bold text-base mb-4">Spending by Category</Text>
              <PieChart
                data={pieData}
                width={screenWidth - 60}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>

            {/* Category Breakdown */}
            <View className="bg-zinc-900/80 border border-zinc-800/50 rounded-2xl p-5">
              <Text className="text-white font-bold text-base mb-4">Breakdown</Text>
              {Object.entries(categoryTotals).map(([cat, amount], index) => {
                const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : '0';
                return (
                  <View key={cat} className="flex-row items-center justify-between mb-3.5">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <Text className="text-zinc-300 text-sm font-medium">{cat}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Text className="text-white font-bold text-sm mr-2">
                        ${amount.toFixed(2)}
                      </Text>
                      <Text className="text-zinc-500 text-xs w-12 text-right">{percentage}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
