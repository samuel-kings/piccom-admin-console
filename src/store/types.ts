import { Profile } from '../models/profile';
import { Challenge } from '../models/challenge';
import { DashboardStats } from '../services/home';

export interface PageState<T> {
  data: T;
  lastFetched: number;
  isLoading: boolean;
  error: string | null;
}

export interface Store {
  // Dashboard state
  dashboard: PageState<DashboardStats>;
  setDashboardData: (data: DashboardStats) => void;
  setDashboardLoading: (isLoading: boolean) => void;
  setDashboardError: (error: string | null) => void;

  // Users state
  users: PageState<{
    profiles: Profile[];
    total: number;
    currentPage: number;
    searchQuery: string;
    statusFilter: string;
  }>;
  setUsersData: (data: { profiles: Profile[]; total: number; currentPage: number; searchQuery: string; statusFilter: string; }) => void;
  setUsersLoading: (isLoading: boolean) => void;
  setUsersError: (error: string | null) => void;

  // Challenges state
  challenges: PageState<{
    challenges: Challenge[];
    total: number;
    currentPage: number;
    searchQuery: string;
    statusFilter: string;
  }>;
  setChallengesData: (data: { challenges: Challenge[]; total: number; currentPage: number; searchQuery: string; statusFilter: string; }) => void;
  setChallengesLoading: (isLoading: boolean) => void;
  setChallengesError: (error: string | null) => void;

  // Global settings
  refreshThreshold: number;
  clearStore: () => void;
}