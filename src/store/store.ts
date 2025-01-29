import { create } from 'zustand';
import { Store, PageState } from './types';

const REFRESH_THRESHOLD = 30000; // 30 seconds

const createEmptyPageState = <T>(): PageState<T> => ({
  data: {} as T,
  lastFetched: 0,
  isLoading: true,
  error: null,
});

const useStore = create<Store>((set) => ({
  // Dashboard state
  dashboard: createEmptyPageState(),
  setDashboardData: (data) =>
    set((state) => ({
      dashboard: {
        ...state.dashboard,
        data,
        lastFetched: Date.now(),
        error: null,
      },
    })),
  setDashboardLoading: (isLoading) =>
    set((state) => ({
      dashboard: { ...state.dashboard, isLoading },
    })),
  setDashboardError: (error) =>
    set((state) => ({
      dashboard: { ...state.dashboard, error, isLoading: false },
    })),

  // Users state
  users: createEmptyPageState(),
  setUsersData: (data) =>
    set((state) => ({
      users: {
        ...state.users,
        data,
        lastFetched: Date.now(),
        error: null,
      },
    })),
  setUsersLoading: (isLoading) =>
    set((state) => ({
      users: { ...state.users, isLoading },
    })),
  setUsersError: (error) =>
    set((state) => ({
      users: { ...state.users, error, isLoading: false },
    })),

  // Challenges state
  challenges: createEmptyPageState(),
  setChallengesData: (data) =>
    set((state) => ({
      challenges: {
        ...state.challenges,
        data,
        lastFetched: Date.now(),
        error: null,
      },
    })),
  setChallengesLoading: (isLoading) =>
    set((state) => ({
      challenges: { ...state.challenges, isLoading },
    })),
  setChallengesError: (error) =>
    set((state) => ({
      challenges: { ...state.challenges, error, isLoading: false },
    })),

  // Global settings
  refreshThreshold: REFRESH_THRESHOLD,
  clearStore: () =>
    set({
      dashboard: createEmptyPageState(),
      users: createEmptyPageState(),
      challenges: createEmptyPageState(),
    }),
}));

export default useStore;