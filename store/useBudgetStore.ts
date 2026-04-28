import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Envelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
}

export interface Transaction {
  id: string;
  envelopeId: string;
  amount: number;
  date: string; // ISO String
  note: string; // Destination (e.g. McDonalds)
}

interface BudgetState {
  envelopes: Envelope[];
  transactions: Transaction[];
  settings: {
    isAuthEnabled: boolean;
    pin: string | null;
  };
  isLocked: boolean;
  addEnvelope: (envelope: Omit<Envelope, 'spent'>) => void;
  updateEnvelope: (id: string, updates: Partial<Omit<Envelope, 'id' | 'spent'>>) => void;
  deleteEnvelope: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  setAuthEnabled: (enabled: boolean) => void;
  setPin: (pin: string | null) => void;
  setLocked: (locked: boolean) => void;
  resetData: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      envelopes: [
        { id: '1', name: 'Food', allocated: 500000, spent: 0, icon: 'utensils' },
        { id: '2', name: 'Transport', allocated: 300000, spent: 0, icon: 'car' },
        { id: '3', name: 'Rent', allocated: 1000000, spent: 0, icon: 'home' },
      ],
      transactions: [],
      settings: {
        isAuthEnabled: false,
        pin: null,
      },
      isLocked: true,

      addEnvelope: (envelope) =>
        set((state) => ({
          envelopes: [...state.envelopes, { ...envelope, spent: 0 }],
        })),

      updateEnvelope: (id, updates) =>
        set((state) => ({
          envelopes: state.envelopes.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),

      deleteEnvelope: (id) =>
        set((state) => ({
          envelopes: state.envelopes.filter((e) => e.id !== id),
          transactions: state.transactions.filter((t) => t.envelopeId !== id),
        })),

      addTransaction: (transaction) =>
        set((state) => {
          const newTransaction = {
            ...transaction,
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString(),
          };
          
          const updatedEnvelopes = state.envelopes.map((e) => {
            if (e.id === transaction.envelopeId) {
              return { ...e, spent: e.spent + transaction.amount };
            }
            return e;
          });

          return {
            transactions: [newTransaction, ...state.transactions],
            envelopes: updatedEnvelopes,
          };
        }),

      setAuthEnabled: (enabled) =>
        set((state) => ({
          settings: { ...state.settings, isAuthEnabled: enabled },
        })),

      setPin: (pin) =>
        set((state) => ({
          settings: { ...state.settings, pin },
        })),

      setLocked: (locked) => set({ isLocked: locked }),

      resetData: () =>
        set({
          envelopes: [],
          transactions: [],
          settings: { isAuthEnabled: false, pin: null },
        }),
    }),
    {
      name: 'budget-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        envelopes: state.envelopes,
        transactions: state.transactions,
        settings: state.settings,
      }),
    }
  )
);
