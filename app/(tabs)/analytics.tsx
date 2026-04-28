import { View, Text, ScrollView } from 'react-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatUGX } from '@/utils/format';

export default function AnalyticsScreen() {
  const { envelopes, transactions } = useBudgetStore();

  const totalSpent = envelopes.reduce((acc, e) => acc + e.spent, 0);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white p-6 rounded-3xl mb-6 shadow-sm">
        <Text className="text-gray-500 text-sm font-medium mb-1">Total Spending</Text>
        <Text className="text-gray-900 text-3xl font-bold">{formatUGX(totalSpent)}</Text>
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-4">Spending by Envelope</Text>
      
      <View className="bg-white p-6 rounded-3xl shadow-sm mb-6">
        {envelopes.length > 0 ? envelopes.map((envelope) => {
          const percentage = totalSpent > 0 ? (envelope.spent / totalSpent) * 100 : 0;
          
          return (
            <View key={envelope.id} className="mb-4">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-700 font-medium">{envelope.name}</Text>
                <Text className="text-gray-500">{formatUGX(envelope.spent)}</Text>
              </View>
              <View className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </View>
            </View>
          );
        }) : (
          <Text className="text-gray-400 text-center">No envelopes found</Text>
        )}
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-4">History</Text>
      <View className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
        {transactions.length > 0 ? (
          transactions.map((t, index) => {
            const envelope = envelopes.find(e => e.id === t.envelopeId);
            return (
              <View 
                key={t.id} 
                className={`p-4 flex-row justify-between items-center ${
                  index !== transactions.length - 1 ? 'border-b border-gray-50' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-base">{t.note}</Text>
                  <Text className="text-gray-500 text-xs">
                    {envelope?.name || 'Unknown'} • {formatDate(t.date)} at {formatTime(t.date)}
                  </Text>
                </View>
                <Text className="text-red-500 font-bold text-base">-{formatUGX(t.amount)}</Text>
              </View>
            );
          })
        ) : (
          <View className="p-8 items-center">
            <Text className="text-gray-400">No transactions yet</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
