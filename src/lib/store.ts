'use client';

import { useState, useEffect, useCallback } from 'react';

// Types
export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalCO2Saved: number;
  streak: number;
  lastActiveDate: string;
  joinDate: string;
  transport: string;
  diet: string;
  energySource: string;
  onboardingComplete: boolean;
}

export interface Activity {
  id: string;
  factorId: string;
  category: string;
  name: string;
  icon: string;
  quantity: number;
  unit: string;
  kgCO2: number;
  timestamp: string;
  xpEarned: number;
}

export interface MissionProgress {
  missionId: string;
  progress: number;
  completed: boolean;
  completedAt?: string;
  claimed: boolean;
}

export interface AchievementProgress {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StoreState {
  user: UserProfile | null;
  activities: Activity[];
  missionProgress: MissionProgress[];
  achievementProgress: AchievementProgress[];
  chatHistory: ChatMessage[];
  dailyMissionsDate: string;
  dailyMissionIds: string[];
}

const STORE_KEY = 'carbonquest_store';

const DEFAULT_STATE: StoreState = {
  user: null,
  activities: [],
  missionProgress: [],
  achievementProgress: [],
  chatHistory: [],
  dailyMissionsDate: '',
  dailyMissionIds: [],
};

function getStoredState(): StoreState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const stored = localStorage.getItem(STORE_KEY);
    if (!stored) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: StoreState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// Level system
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; xpToNext: number } {
  let level = 1;
  let xpAccumulated = 0;
  while (true) {
    const xpNeeded = getXPForLevel(level);
    if (xpAccumulated + xpNeeded > totalXP) {
      return {
        level,
        currentXP: totalXP - xpAccumulated,
        xpToNext: xpNeeded,
      };
    }
    xpAccumulated += xpNeeded;
    level++;
  }
}

export const LEVEL_TITLES = [
  'Seedling',         // 1
  'Sprout',           // 2
  'Sapling',          // 3
  'Green Leaf',       // 4
  'Young Tree',       // 5
  'Oak',              // 6
  'Redwood',          // 7
  'Forest Guardian',  // 8
  'Eco Warrior',      // 9
  'Planet Protector', // 10
  'Climate Champion', // 11
  'Earth Hero',       // 12
  'Sustainability Sage', // 13
  'Carbon Conqueror', // 14
  'Eco Legend',       // 15
];

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
}

const AVATARS = ['🌱', '🌿', '🍀', '🌳', '🌲', '🌻', '🦋', '🐝', '🌎', '🌍', '🦜', '🐢'];

export function getRandomAvatar(): string {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

// Custom hook for store
export function useStore() {
  const [state, setState] = useState<StoreState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setState(getStoredState());
    setIsLoaded(true);
  }, []);

  const updateState = useCallback((updater: (prev: StoreState) => StoreState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  const createUser = useCallback(
    (name: string, transport: string, diet: string, energySource: string) => {
      const now = new Date().toISOString();
      updateState((prev) => ({
        ...prev,
        user: {
          name,
          avatar: getRandomAvatar(),
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          totalCO2Saved: 0,
          streak: 1,
          lastActiveDate: now.split('T')[0],
          joinDate: now,
          transport,
          diet,
          energySource,
          onboardingComplete: true,
        },
      }));
    },
    [updateState]
  );

  const addActivity = useCallback(
    (activity: Omit<Activity, 'id' | 'timestamp' | 'xpEarned'>) => {
      const xpEarned = Math.max(5, Math.round(20 - activity.kgCO2 * 2));
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        xpEarned,
      };

      updateState((prev) => {
        const newXP = (prev.user?.xp || 0) + xpEarned;
        const levelInfo = getLevelFromXP(newXP);
        const today = new Date().toISOString().split('T')[0];
        const lastActive = prev.user?.lastActiveDate;
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        let streak = prev.user?.streak || 0;
        if (lastActive === yesterday) streak += 1;
        else if (lastActive !== today) streak = 1;

        return {
          ...prev,
          activities: [newActivity, ...prev.activities],
          user: prev.user
            ? {
                ...prev.user,
                xp: newXP,
                level: levelInfo.level,
                xpToNextLevel: levelInfo.xpToNext,
                totalCO2Saved: prev.user.totalCO2Saved + Math.max(0, 5 - activity.kgCO2),
                streak,
                lastActiveDate: today,
              }
            : null,
        };
      });

      return xpEarned;
    },
    [updateState]
  );

  const completeMission = useCallback(
    (missionId: string) => {
      updateState((prev) => {
        const existing = prev.missionProgress.find((m) => m.missionId === missionId);
        if (existing?.completed) return prev;

        const newProgress = prev.missionProgress.filter((m) => m.missionId !== missionId);
        newProgress.push({
          missionId,
          progress: 1,
          completed: true,
          completedAt: new Date().toISOString(),
          claimed: false,
        });

        return { ...prev, missionProgress: newProgress };
      });
    },
    [updateState]
  );

  const claimMissionReward = useCallback(
    (missionId: string, xpReward: number) => {
      updateState((prev) => {
        const mission = prev.missionProgress.find((m) => m.missionId === missionId);
        if (!mission?.completed || mission.claimed) return prev;

        const newXP = (prev.user?.xp || 0) + xpReward;
        const levelInfo = getLevelFromXP(newXP);

        return {
          ...prev,
          missionProgress: prev.missionProgress.map((m) =>
            m.missionId === missionId ? { ...m, claimed: true } : m
          ),
          user: prev.user
            ? {
                ...prev.user,
                xp: newXP,
                level: levelInfo.level,
                xpToNextLevel: levelInfo.xpToNext,
              }
            : null,
        };
      });
    },
    [updateState]
  );

  const unlockAchievement = useCallback(
    (achievementId: string) => {
      updateState((prev) => {
        const existing = prev.achievementProgress.find((a) => a.achievementId === achievementId);
        if (existing?.unlocked) return prev;

        const newProgress = prev.achievementProgress.filter((a) => a.achievementId !== achievementId);
        newProgress.push({
          achievementId,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: 1,
        });

        // Award XP for achievement
        const bonusXP = 50;
        const newXP = (prev.user?.xp || 0) + bonusXP;
        const levelInfo = getLevelFromXP(newXP);

        return {
          ...prev,
          achievementProgress: newProgress,
          user: prev.user
            ? {
                ...prev.user,
                xp: newXP,
                level: levelInfo.level,
                xpToNextLevel: levelInfo.xpToNext,
              }
            : null,
        };
      });
    },
    [updateState]
  );

  const addChatMessage = useCallback(
    (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      updateState((prev) => ({
        ...prev,
        chatHistory: [
          ...prev.chatHistory,
          {
            ...message,
            id: Date.now().toString(36) + Math.random().toString(36).slice(2),
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    },
    [updateState]
  );

  const setDailyMissions = useCallback(
    (date: string, missionIds: string[]) => {
      updateState((prev) => ({
        ...prev,
        dailyMissionsDate: date,
        dailyMissionIds: missionIds,
      }));
    },
    [updateState]
  );

  const resetStore = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORE_KEY);
    }
    setState(DEFAULT_STATE);
  }, []);

  // Helper: get today's activities
  const todayActivities = state.activities.filter(
    (a) => a.timestamp.split('T')[0] === new Date().toISOString().split('T')[0]
  );

  const todayCO2 = todayActivities.reduce((sum, a) => sum + a.kgCO2, 0);

  // Helper: get this week's activities
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekActivities = state.activities.filter(
    (a) => new Date(a.timestamp) >= weekStart
  );
  const weekCO2 = weekActivities.reduce((sum, a) => sum + a.kgCO2, 0);

  return {
    state,
    isLoaded,
    user: state.user,
    activities: state.activities,
    todayActivities,
    todayCO2,
    weekActivities,
    weekCO2,
    chatHistory: state.chatHistory,
    missionProgress: state.missionProgress,
    achievementProgress: state.achievementProgress,
    dailyMissionsDate: state.dailyMissionsDate,
    dailyMissionIds: state.dailyMissionIds,
    createUser,
    addActivity,
    completeMission,
    claimMissionReward,
    unlockAchievement,
    addChatMessage,
    setDailyMissions,
    resetStore,
  };
}
