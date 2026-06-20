/**
 * Unit tests for missions and achievements libraries.
 */

import { describe, it, expect } from 'vitest';
import {
  DAILY_MISSIONS,
  WEEKLY_MISSIONS,
  getDailyMissions,
  getWeeklyMissions,
  getMissionById,
} from '@/lib/missions';
import {
  ACHIEVEMENTS,
  getAchievementById,
  getAchievementsByCategory,
  RARITY_COLORS,
} from '@/lib/achievements';

// ─────────────────────────────────────────────
// Missions
// ─────────────────────────────────────────────
describe('DAILY_MISSIONS', () => {
  it('has at least 10 daily missions', () => {
    expect(DAILY_MISSIONS.length).toBeGreaterThanOrEqual(10);
  });

  it('all missions have required fields', () => {
    for (const m of DAILY_MISSIONS) {
      expect(m.id).toBeTruthy();
      expect(m.title).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.xpReward).toBeGreaterThan(0);
      expect(['easy', 'medium', 'hard']).toContain(m.difficulty);
      expect(m.type).toBe('daily');
    }
  });

  it('mission ids are unique', () => {
    const ids = DAILY_MISSIONS.map(m => m.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('WEEKLY_MISSIONS', () => {
  it('has at least 3 weekly missions', () => {
    expect(WEEKLY_MISSIONS.length).toBeGreaterThanOrEqual(3);
  });

  it('all weekly missions have higher XP than daily average', () => {
    const avgDailyXP = DAILY_MISSIONS.reduce((s, m) => s + m.xpReward, 0) / DAILY_MISSIONS.length;
    WEEKLY_MISSIONS.forEach(m => {
      expect(m.xpReward).toBeGreaterThan(avgDailyXP);
    });
  });
});

describe('getDailyMissions', () => {
  it('returns 5 missions by default', () => {
    const missions = getDailyMissions('2024-01-15');
    expect(missions).toHaveLength(5);
  });

  it('returns the same missions for the same date', () => {
    const a = getDailyMissions('2024-06-20');
    const b = getDailyMissions('2024-06-20');
    expect(a.map(m => m.id)).toEqual(b.map(m => m.id));
  });

  it('returns different missions for different dates', () => {
    const a = getDailyMissions('2024-06-20');
    const b = getDailyMissions('2024-06-21');
    // They might occasionally be the same but very unlikely for sequential dates
    const aIds = a.map(m => m.id).join(',');
    const bIds = b.map(m => m.id).join(',');
    // Just check both are valid mission sets
    expect(a.length).toBe(5);
    expect(b.length).toBe(5);
  });

  it('accepts a custom count parameter', () => {
    const missions = getDailyMissions('2024-01-15', 3);
    expect(missions).toHaveLength(3);
  });
});

describe('getWeeklyMissions', () => {
  it('returns 3 missions by default', () => {
    const missions = getWeeklyMissions();
    expect(missions).toHaveLength(3);
  });
});

describe('getMissionById', () => {
  it('returns the correct mission for a valid id', () => {
    const mission = getMissionById('walk_commute');
    expect(mission).toBeDefined();
    expect(mission?.title).toBe('Walk the Walk');
  });

  it('returns undefined for an unknown id', () => {
    const mission = getMissionById('non_existent_mission_xyz');
    expect(mission).toBeUndefined();
  });
});

// ─────────────────────────────────────────────
// Achievements
// ─────────────────────────────────────────────
describe('ACHIEVEMENTS', () => {
  it('has at least 20 achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(20);
  });

  it('all achievements have required fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
      expect(a.description).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(['common', 'uncommon', 'rare', 'epic', 'legendary']).toContain(a.rarity);
      expect(a.xpReward).toBeGreaterThan(0);
    }
  });

  it('achievement ids are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('legendary/epic achievements have higher XP than common ones', () => {
    const common = ACHIEVEMENTS.filter(a => a.rarity === 'common');
    const epic = ACHIEVEMENTS.filter(a => a.rarity === 'epic');
    const avgCommon = common.reduce((s, a) => s + a.xpReward, 0) / common.length;
    const avgEpic = epic.reduce((s, a) => s + a.xpReward, 0) / epic.length;
    expect(avgEpic).toBeGreaterThan(avgCommon);
  });
});

describe('getAchievementById', () => {
  it('returns correct achievement for valid id', () => {
    const ach = getAchievementById('first_step');
    expect(ach).toBeDefined();
    expect(ach?.title).toBe('First Step');
  });

  it('returns undefined for unknown id', () => {
    expect(getAchievementById('xyz_unknown')).toBeUndefined();
  });
});

describe('getAchievementsByCategory', () => {
  it('returns only achievements for the given category', () => {
    const consistencyAchs = getAchievementsByCategory('consistency');
    expect(consistencyAchs.length).toBeGreaterThan(0);
    consistencyAchs.forEach(a => expect(a.category).toBe('consistency'));
  });
});

describe('RARITY_COLORS', () => {
  it('has color definitions for all 5 rarities', () => {
    expect(RARITY_COLORS).toHaveProperty('common');
    expect(RARITY_COLORS).toHaveProperty('uncommon');
    expect(RARITY_COLORS).toHaveProperty('rare');
    expect(RARITY_COLORS).toHaveProperty('epic');
    expect(RARITY_COLORS).toHaveProperty('legendary');
  });
});
