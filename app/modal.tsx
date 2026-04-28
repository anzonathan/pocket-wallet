import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useRouter } from 'expo-router';
import { X, Check } from 'lucide-react-native';

export default function AddTransactionModal() {
  const { envelopes, addTransaction } = useBudgetStore();
  const router = useRouter();
  
  const [amount, setAmount] = useState('');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState(envelopes[0]?.id || '');
  const [destination, setDestination] = useState('');

  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedEnvelopeId) {
      Alert.alert('Error', 'Please select an envelope');
      return;
    }

    if (!destination.trim()) {
      Alert.alert('Error', 'Please enter where this money went');
      return;
    }

    addTransaction({
      envelopeId: selectedEnvelopeId,
      amount: numAmount,
      note: destination.trim(),
    });

    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">New Transaction</Text>
        <TouchableOpacity onPress={handleSave}>
          <Check size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <ScrollView className="p-4">
        <View className="mb-6">
          <Text className="text-gray-500 mb-2 font-medium">Amount (UGX)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            keyboardType="numeric"
            className="text-4xl font-bold text-gray-900 border-b-2 border-blue-600 pb-2"
            autoFocus
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 mb-2 font-medium">Where did it go?</Text>
          <TextInput
            value={destination}
            onChangeText={setDestination}
            placeholder="e.g. McDonalds, Shell, Rent"
            className="bg-gray-100 p-4 rounded-xl text-gray-900 font-medium"
          />
        </View>

        <View className="mb-6">
          <Text className="text-gray-500 mb-2 font-medium">Envelope</Text>
          <View className="flex-row flex-wrap">
            {envelopes.map((envelope) => (
              <TouchableOpacity
                key={envelope.id}
                onPress={() => setSelectedEnvelopeId(envelope.id)}
                className={`mr-2 mb-2 px-4 py-2 rounded-full border ${
                  selectedEnvelopeId === envelope.id
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedEnvelopeId === envelope.id ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {envelope.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSave}
          className="bg-blue-600 p-4 rounded-2xl items-center shadow-lg shadow-blue-200 mt-4"
        >
          <Text className="text-white font-bold text-lg">Save Transaction</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
