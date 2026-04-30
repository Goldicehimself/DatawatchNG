"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

type AlertState = "open" | "dismissed" | "flagged" | "investigating";

type AppState = {
  token: string;
  phoneNumber: string;
  networkProvider: string;
  isVerified: boolean;
  isActivated: boolean;
  demoMode: boolean;
  fraudProtection: boolean;
  pidginResponses: boolean;
  alertStates: Record<string, AlertState>;
  cancelledSubscriptions: string[];
  watcherMessages: ChatMessage[];
  setSession: (token: string, phoneNumber: string, networkProvider: string) => void;
  completeVerification: (phoneNumber: string, networkProvider: string) => void;
  activateLine: () => void;
  toggleDemoMode: () => void;
  setFraudProtection: (enabled: boolean) => void;
  setPidginResponses: (enabled: boolean) => void;
  setAlertState: (title: string, state: AlertState) => void;
  cancelSubscription: (name: string) => void;
  addWatcherMessages: (messages: ChatMessage[]) => void;
  resetWatcher: () => void;
  logout: () => void;
};

const initialWatcherMessages: ChatMessage[] = [
  {
    role: "assistant",
    text: "Hi. I'm Watcher. Once your line is activated I'll tell you exactly where your data and money are going. You can still ask me anything in the meantime.",
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: "",
      phoneNumber: "",
      networkProvider: "",
      isVerified: false,
      isActivated: false,
      demoMode: false,
      fraudProtection: true,
      pidginResponses: false,
      alertStates: {},
      cancelledSubscriptions: [],
      watcherMessages: initialWatcherMessages,
      setSession: (token, phoneNumber, networkProvider) =>
        set({
          token,
          phoneNumber,
          networkProvider,
          isVerified: true,
          isActivated: true,
          demoMode: false,
        }),
      completeVerification: (phoneNumber, networkProvider) =>
        set({
          phoneNumber,
          networkProvider,
          isVerified: true,
          isActivated: true,
        }),
      activateLine: () => set({ isActivated: true }),
      toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),
      setFraudProtection: (enabled) => set({ fraudProtection: enabled }),
      setPidginResponses: (enabled) => set({ pidginResponses: enabled }),
      setAlertState: (title, state) =>
        set((current) => ({
          alertStates: {
            ...current.alertStates,
            [title]: state,
          },
        })),
      cancelSubscription: (name) =>
        set((current) => ({
          cancelledSubscriptions: current.cancelledSubscriptions.includes(name)
            ? current.cancelledSubscriptions
            : [...current.cancelledSubscriptions, name],
        })),
      addWatcherMessages: (messages) =>
        set((current) => ({
          watcherMessages: [...current.watcherMessages, ...messages],
        })),
      resetWatcher: () => set({ watcherMessages: initialWatcherMessages }),
      logout: () =>
        set({
          token: "",
          phoneNumber: "",
          networkProvider: "",
          isVerified: false,
          isActivated: false,
          demoMode: false,
          watcherMessages: initialWatcherMessages,
        }),
    }),
    {
      name: "datawatch-ng-state",
    },
  ),
);
