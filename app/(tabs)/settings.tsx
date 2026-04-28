import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useBudgetStore } from '@/store/useBudgetStore';
import { Lock, Fingerprint, Trash2, RefreshCcw, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const { settings, setAuthEnabled, setPin, resetData } = useBudgetStore();
  const [showPinInput, setShowPinInput] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleToggleAuth = (value: boolean) => {
    if (value && !settings.pin) {
      setShowPinInput(true);
    } else {
      setAuthEnabled(value);
    }
  };

  const handleSavePin = () => {
    if (newPin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits');
      return;
    }
    setPin(newPin);
    setAuthEnabled(true);
    setShowPinInput(false);
    setNewPin('');
    Alert.alert('Success', 'Security enabled');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all envelopes and transactions? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetData },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="bg-white rounded-3xl shadow-sm overflow-hidden mb-6">
        <View className="p-4 border-b border-gray-50 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="bg-blue-50 p-2 rounded-lg mr-3">
              <ShieldCheck size={20} color="#2563eb" />
            </View>
            <View>
              <Text className="text-gray-900 font-bold">App Lock</Text>
              <Text className="text-gray-500 text-xs">Biometrics or PIN</Text>
            </View>
          </View>
          <Switch
            value={settings.isAuthEnabled}
            onValueChange={handleToggleAuth}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={settings.isAuthEnabled ? '#2563eb' : '#f8fafc'}
          />
        </View>

        {settings.isAuthEnabled && (
          <TouchableOpacity 
            onPress={() => setShowPinInput(true)}
            className="p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="bg-blue-50 p-2 rounded-lg mr-3">
                <Lock size={20} color="#2563eb" />
              </View>
              <Text className="text-gray-900 font-medium">Change PIN</Text>
            </View>
            <Text className="text-gray-400">****</Text>
          </TouchableOpacity>
        )}
      </View>

      {showPinInput && (
        <View className="bg-blue-50 p-6 rounded-3xl mb-6 border border-blue-100">
          <Text className="text-blue-900 font-bold mb-2">Set 4-Digit PIN</Text>
          <Text className="text-blue-700 text-sm mb-4">
            This will be used if biometric authentication fails.
          </Text>
          <TextInput
            value={newPin}
            onChangeText={setNewPin}
            placeholder="****"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            className="bg-white p-4 rounded-xl text-2xl tracking-widest text-center mb-4"
          />
          <View className="flex-row gap-2">
            <TouchableOpacity 
              onPress={() => setShowPinInput(false)}
              className="flex-1 bg-white p-4 rounded-xl items-center border border-blue-200"
            >
              <Text className="text-blue-600 font-bold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleSavePin}
              className="flex-1 bg-blue-600 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text className="text-gray-400 font-bold ml-4 mb-2 uppercase text-xs">Danger Zone</Text>
      <View className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8">
        <TouchableOpacity 
          onPress={handleReset}
          className="p-4 flex-row items-center"
        >
          <View className="bg-red-50 p-2 rounded-lg mr-3">
            <Trash2 size={20} color="#ef4444" />
          </View>
          <View>
            <Text className="text-red-600 font-bold">Reset All Data</Text>
            <Text className="text-gray-500 text-xs">Clear all envelopes and transactions</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="items-center py-8">
        <Text className="text-gray-300 text-sm">Pocket UGX v1.0.0</Text>
        <Text className="text-gray-300 text-xs mt-1">Minimal Envelope Budgeting</Text>
      </View>
    </ScrollView>
  );
}
