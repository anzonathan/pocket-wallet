import { View, Text, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { formatUGX } from '@/utils/format';
import { Plus, Utensils, Car, Home, Wallet as WalletIcon, MoreHorizontal } from 'lucide-react-native';
import { Link } from 'expo-router';

const IconMap: any = {
  utensils: Utensils,
  car: Car,
  home: Home,
  wallet: WalletIcon,
};

export default function WalletScreen() {
  const { envelopes, transactions } = useBudgetStore();

  const totalBalance = envelopes.reduce((acc, e) => acc + (e.allocated - e.spent), 0);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-6">
        {/* Total Balance Card */}
        <View className="bg-blue-600 p-6 rounded-3xl mb-8 shadow-lg shadow-blue-200">
          <Text className="text-blue-100 text-sm font-medium mb-1">Total Available</Text>
          <Text className="text-white text-3xl font-bold">{formatUGX(totalBalance)}</Text>
        </View>

        {/* Envelopes Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-gray-900">Your Envelopes</Text>
          <Link href="/manage-envelopes" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">Manage</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {envelopes.map((envelope) => {
          const Icon = IconMap[envelope.icon] || WalletIcon;
          const progress = Math.min(envelope.spent / envelope.allocated, 1);
          const remaining = envelope.allocated - envelope.spent;

          return (
            <View key={envelope.id} className="bg-white p-4 rounded-2xl mb-4 border border-gray-100 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-blue-50 p-3 rounded-xl mr-4">
                  <Icon size={24} color="#2563eb" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-lg">{envelope.name}</Text>
                  <Text className="text-gray-500 text-sm">
                    {formatUGX(remaining)} left of {formatUGX(envelope.allocated)}
                  </Text>
                </View>
                <TouchableOpacity>
                  <MoreHorizontal size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              {/* Progress Bar */}
              <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <View 
                  className={`h-full ${progress > 0.9 ? 'bg-red-500' : 'bg-blue-600'}`}
                  style={{ width: `${progress * 100}%` }}
                />
              </View>
            </View>
          );
        })}

        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <Link href="/modal" asChild>
        <TouchableOpacity 
          className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-xl shadow-blue-300"
          activeOpacity={0.8}
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
