/**
 * Unit tests for carbon emission calculation logic.
 * Tests the core business logic in carbon-data.ts and store.ts
 */

import { describe, it, expect } from 'vitest';
import {
  EMISSION_FACTORS,
  calculateEcoScore,
  getCO2Comparison,
  getFactorsByCategory,
  getFactorById,
  NATIONAL_AVERAGES,
} from '@/lib/carbon-data';
import {
  getLevelFromXP,
  getXPForLevel,
  getLevelTitle,
  LEVEL_TITLES,
} from '@/lib/store';

// ─────────────────────────────────────────────
// Emission Factors
// ─────────────────────────────────────────────
describe('EMISSION_FACTORS', () => {
  it('contains at least 30 emission factors', () => {
    expect(EMISSION_FACTORS.length).toBeGreaterThanOrEqual(30);
  });

  it('every factor has required fields', () => {
    for (const f of EMISSION_FACTORS) {
      expect(f.id).toBeTruthy();
      expect(f.name).toBeTruthy();
      expect(f.category).toBeTruthy();
      expect(f.unit).toBeTruthy();
      expect(typeof f.kgCO2PerUnit).toBe('number');
      expect(f.kgCO2PerUnit).toBeGreaterThanOrEqual(0);
    }
  });

  it('bicycle and walking have zero emissions', () => {
    const bicycle = getFactorById('bicycle');
    const walk = getFactorById('walk');
    expect(bicycle?.kgCO2PerUnit).toBe(0);
    expect(walk?.kgCO2PerUnit).toBe(0);
  });

  it('beef meal has higher emissions than vegan meal', () => {
    const beef = getFactorById('beef_meal');
    const vegan = getFactorById('vegan_meal');
    expect(beef!.kgCO2PerUnit).toBeGreaterThan(vegan!.kgCO2PerUnit);
  });

  it('new laptop has highest shopping emissions', () => {
    const laptop = getFactorById('new_laptop');
    const phone = getFactorById('new_phone');
    expect(laptop!.kgCO2PerUnit).toBeGreaterThan(phone!.kgCO2PerUnit);
  });
});

// ─────────────────────────────────────────────
// getFactorsByCategory
// ─────────────────────────────────────────────
describe('getFactorsByCategory', () => {
  it('returns only transport factors for transport category', () => {
    const factors = getFactorsByCategory('transport');
    expect(factors.length).toBeGreaterThan(0);
    factors.forEach(f => expect(f.category).toBe('transport'));
  });

  it('returns only food factors for food category', () => {
    const factors = getFactorsByCategory('food');
    expect(factors.length).toBeGreaterThan(0);
    factors.forEach(f => expect(f.category).toBe('food'));
  });
});

// ─────────────────────────────────────────────
// calculateEcoScore
// ─────────────────────────────────────────────
describe('calculateEcoScore', () => {
  it('returns 100 for zero emissions', () => {
    expect(calculateEcoScore(0)).toBe(100);
  });

  it('returns 0 for emissions >= 2x global average', () => {
    const doubleAvg = NATIONAL_AVERAGES.global * 2;
    expect(calculateEcoScore(doubleAvg)).toBe(0);
    expect(calculateEcoScore(doubleAvg + 10)).toBe(0);
  });

  it('returns a value between 0 and 100 for moderate emissions', () => {
    const score = calculateEcoScore(NATIONAL_AVERAGES.global);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('lower emissions produce a higher score', () => {
    const low = calculateEcoScore(2);
    const high = calculateEcoScore(10);
    expect(low).toBeGreaterThan(high);
  });
});

// ─────────────────────────────────────────────
// getCO2Comparison
// ─────────────────────────────────────────────
describe('getCO2Comparison', () => {
  it('returns an object with text and icon', () => {
    const result = getCO2Comparison(1);
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('icon');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('large values fall back to tree equivalents', () => {
    const result = getCO2Comparison(1000);
    expect(result.text).toContain('trees');
  });
});

// ─────────────────────────────────────────────
// Level System
// ─────────────────────────────────────────────
describe('getXPForLevel', () => {
  it('level 1 requires 100 XP', () => {
    expect(getXPForLevel(1)).toBe(100);
  });

  it('each level requires more XP than the previous', () => {
    for (let lvl = 1; lvl < 10; lvl++) {
      expect(getXPForLevel(lvl + 1)).toBeGreaterThan(getXPForLevel(lvl));
    }
  });
});

describe('getLevelFromXP', () => {
  it('0 XP returns level 1', () => {
    const result = getLevelFromXP(0);
    expect(result.level).toBe(1);
    expect(result.currentXP).toBe(0);
  });

  it('correctly calculates level from accumulated XP', () => {
    // Level 1 = 100 XP threshold, so 100 XP takes you to level 2
    const result = getLevelFromXP(100);
    expect(result.level).toBe(2);
  });

  it('currentXP is always less than xpToNext', () => {
    for (const xp of [0, 50, 200, 500, 1000, 5000]) {
      const result = getLevelFromXP(xp);
      expect(result.currentXP).toBeLessThan(result.xpToNext);
    }
  });
});

describe('getLevelTitle', () => {
  it('level 1 is Seedling', () => {
    expect(getLevelTitle(1)).toBe('Seedling');
  });

  it('level 10 is Planet Protector', () => {
    expect(getLevelTitle(10)).toBe('Planet Protector');
  });

  it('levels beyond max return the last title', () => {
    const lastTitle = LEVEL_TITLES[LEVEL_TITLES.length - 1];
    expect(getLevelTitle(999)).toBe(lastTitle);
  });
});
