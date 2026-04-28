import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from 'react-native';
import { useBudgetStore, Envelope } from '@/store/useBudgetStore';
import { useRouter } from 'expo-router';
import { X, Check, Trash2, Plus, Utensils, Car, Home, Wallet, ShoppingBag, Zap } from 'lucide-react-native';

const ICONS = [
  { name: 'utensils', icon: Utensils },
  { name: 'car', icon: Car },
  { name: 'home', icon: Home },
  { name: 'wallet', icon: Wallet },
  { name: 'shopping-bag', icon: ShoppingBag },
  { name: 'zap', icon: Zap },
];

export default function ManageEnvelopesScreen() {
  const { envelopes, addEnvelope, updateEnvelope, deleteEnvelope } = useBudgetStore();
  const router = useRouter();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [allocated, setAllocated] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('wallet');

  const startAdding = () => {
    setEditingId('new');
    setName('');
    setAllocated('');
    setSelectedIcon('wallet');
  };

  const startEditing = (envelope: Envelope) => {
    setEditingId(envelope.id);
    setName(envelope.name);
    setAllocated(envelope.allocated.toString());
    setSelectedIcon(envelope.icon);
  };

  const handleSave = () => {
    const numAllocated = parseFloat(allocated);
    if (!name.trim() || isNaN(numAllocated) || numAllocated <= 0) {
      Alert.alert('Error', 'Please enter a valid name and amount');
      return;
    }

    if (editingId === 'new') {
      addEnvelope({
        id: Math.random().toString(36).substring(7),
        name: name.trim(),
        allocated: numAllocated,
        icon: selectedIcon,
      });
    } else if (editingId) {
      updateEnvelope(editingId, {
        name: name.trim(),
        allocated: numAllocated,
        icon: selectedIcon,
      });
    }

    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Envelope',
      'Are you sure? All transactions in this envelope will also be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteEnvelope(id) },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Manage Envelopes</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 p-4">
        {editingId ? (
          <View className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-6">
            <Text className="text-gray-900 font-bold text-lg mb-4">
              {editingId === 'new' ? 'Create New Envelope' : 'Edit Envelope'}
            </Text>
            
            <Text className="text-gray-500 mb-2 font-medium">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Groceries"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
            />

            <Text className="text-gray-500 mb-2 font-medium">Monthly Budget (UGX)</Text>
            <TextInput
              value={allocated}
              onChangeText={setAllocated}
              placeholder="0"
              keyboardType="numeric"
              className="bg-white p-4 rounded-xl mb-4 border border-gray-200"
            />

            <Text className="text-gray-500 mb-2 font-medium">Icon</Text>
            <View className="flex-row flex-wrap mb-6">
              {ICONS.map((item) => (
                <TouchableOpacity
                  key={item.name}
                  onPress={() => setSelectedIcon(item.name)}
                  className={`p-3 rounded-xl mr-2 mb-2 ${
                    selectedIcon === item.name ? 'bg-blue-600' : 'bg-white border border-gray-200'
                  }`}
                >
                  <item.icon size={24} color={selectedIcon === item.name ? 'white' : '#64748b'} />
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setEditingId(null)}
                className="flex-1 bg-white p-4 rounded-xl items-center border border-gray-200"
              >
                <Text className="text-gray-600 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
              >
                <Text className="text-white font-bold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={startAdding}
            className="flex-row items-center justify-center bg-blue-50 p-4 rounded-2xl border border-dashed border-blue-300 mb-6"
          >
            <Plus size={20} color="#2563eb" className="mr-2" />
            <Text className="text-blue-600 font-bold ml-2">Create New Envelope</Text>
          </TouchableOpacity>
        )}

        <Text className="text-gray-400 font-bold mb-4 uppercase text-xs">Existing Envelopes</Text>
        {envelopes.map((envelope) => (
          <View key={envelope.id} className="flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 mb-3 shadow-sm">
            <View className="bg-gray-50 p-3 rounded-xl mr-4">
              {ICONS.find(i => i.name === envelope.icon)?.icon ? (
                (() => {
                  const Icon = ICONS.find(i => i.name === envelope.icon)!.icon;
                  return <Icon size={20} color="#2563eb" />;
                })()
              ) : <Wallet size={20} color="#2563eb" />}
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-bold">{envelope.name}</Text>
              <Text className="text-gray-500 text-xs">Allocated: {envelope.allocated.toLocaleString()} UGX</Text>
            </View>
            <TouchableOpacity onPress={() => startEditing(envelope)} className="p-2 mr-1">
              <Check size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(envelope.id)} className="p-2">
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
