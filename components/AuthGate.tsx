import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useBudgetStore } from '../store/useBudgetStore';
import { Lock, Fingerprint, Keyboard } from 'lucide-react-native';

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isLocked, setLocked, settings } = useBudgetStore();
  const [pinInput, setPinInput] = useState('');
  const [authMethod, setAuthMethod] = useState<'biometric' | 'pin'>('biometric');

  useEffect(() => {
    if (settings.isAuthEnabled && isLocked) {
      handleBiometricAuth();
    } else {
      setLocked(false);
    }
  }, [settings.isAuthEnabled]);

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (hasHardware && isEnrolled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Unlock Pocket',
          fallbackLabel: 'Use PIN',
        });

        if (result.success) {
          setLocked(false);
        } else {
          setAuthMethod('pin');
        }
      } else {
        setAuthMethod('pin');
      }
    } catch (error) {
      setAuthMethod('pin');
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === settings.pin) {
      setLocked(false);
    } else {
      Alert.alert('Error', 'Incorrect PIN');
      setPinInput('');
    }
  };

  if (settings.isAuthEnabled && isLocked) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-6">
        <View className="bg-blue-100 p-6 rounded-full mb-6">
          <Lock size={48} color="#2563eb" />
        </View>
        <Text className="text-2xl font-bold text-gray-900 mb-2">Locked</Text>
        <Text className="text-gray-500 text-center mb-8">
          Please authenticate to access your budget.
        </Text>

        {authMethod === 'biometric' ? (
          <TouchableOpacity
            onPress={handleBiometricAuth}
            className="flex-row items-center bg-blue-600 px-6 py-3 rounded-xl"
          >
            <Fingerprint size={24} color="white" />
            <Text className="text-white font-semibold ml-2">Try Fingerprint</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-full max-w-xs">
            <TextInput
              value={pinInput}
              onChangeText={setPinInput}
              placeholder="Enter PIN"
              keyboardType="numeric"
              secureTextEntry
              className="bg-gray-100 p-4 rounded-xl text-center text-2xl tracking-widest mb-4"
              maxLength={4}
            />
            <TouchableOpacity
              onPress={handlePinSubmit}
              className="bg-blue-600 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-bold">Unlock</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={() => setAuthMethod(authMethod === 'biometric' ? 'pin' : 'biometric')}
          className="mt-6"
        >
          <Text className="text-blue-600 font-medium">
            {authMethod === 'biometric' ? 'Use PIN instead' : 'Use Biometrics'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
};
