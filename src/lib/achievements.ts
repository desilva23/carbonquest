export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: string;
  condition: string;
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Log your very first activity',
    icon: '👣',
    rarity: 'common',
    category: 'beginner',
    condition: 'Log 1 activity',
    xpReward: 25,
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'Complete the onboarding quiz',
    icon: '🎯',
    rarity: 'common',
    category: 'beginner',
    condition: 'Complete onboarding',
    xpReward: 20,
  },
  {
    id: 'first_mission',
    title: 'Mission Accepted',
    description: 'Complete your first daily mission',
    icon: '✅',
    rarity: 'common',
    category: 'beginner',
    condition: 'Complete 1 mission',
    xpReward: 30,
  },
  {
    id: 'carbon_aware',
    title: 'Carbon Aware',
    description: 'Log activities across 3 different categories',
    icon: '🧠',
    rarity: 'common',
    category: 'beginner',
    condition: 'Use 3 categories',
    xpReward: 35,
  },

  // Consistency
  {
    id: 'streak_3',
    title: 'Three-peat',
    description: 'Maintain a 3-day activity streak',
    icon: '🔥',
    rarity: 'common',
    category: 'consistency',
    condition: '3-day streak',
    xpReward: 40,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day activity streak',
    icon: '⚡',
    rarity: 'uncommon',
    category: 'consistency',
    condition: '7-day streak',
    xpReward: 75,
  },
  {
    id: 'streak_14',
    title: 'Fortnight Fighter',
    description: 'Maintain a 14-day activity streak',
    icon: '💪',
    rarity: 'rare',
    category: 'consistency',
    condition: '14-day streak',
    xpReward: 150,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day activity streak',
    icon: '👑',
    rarity: 'epic',
    category: 'consistency',
    condition: '30-day streak',
    xpReward: 300,
  },

  // Transport
  {
    id: 'green_commuter',
    title: 'Green Commuter',
    description: 'Log 10 public transport or walking trips',
    icon: '🚌',
    rarity: 'uncommon',
    category: 'transport',
    condition: '10 green transport logs',
    xpReward: 60,
  },
  {
    id: 'zero_emission',
    title: 'Zero Emission Hero',
    description: 'Walk or bike for 50km total',
    icon: '🚲',
    rarity: 'rare',
    category: 'transport',
    condition: '50km walked/biked',
    xpReward: 100,
  },
  {
    id: 'car_free_week',
    title: 'Car-Free Week',
    description: 'Go 7 days without logging a car trip',
    icon: '🌿',
    rarity: 'rare',
    category: 'transport',
    condition: 'No car for 7 days',
    xpReward: 120,
  },

  // Food
  {
    id: 'green_chef',
    title: 'Green Chef',
    description: 'Log 5 plant-based meals',
    icon: '🌱',
    rarity: 'uncommon',
    category: 'food',
    condition: '5 plant-based meals',
    xpReward: 50,
  },
  {
    id: 'vegan_explorer',
    title: 'Vegan Explorer',
    description: 'Log 20 vegan meals',
    icon: '🥑',
    rarity: 'rare',
    category: 'food',
    condition: '20 vegan meals',
    xpReward: 100,
  },
  {
    id: 'meatless_master',
    title: 'Meatless Master',
    description: 'Go a full week without meat',
    icon: '🥬',
    rarity: 'epic',
    category: 'food',
    condition: 'Meatless week',
    xpReward: 150,
  },

  // Energy
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Log 10 energy-saving activities',
    icon: '💡',
    rarity: 'uncommon',
    category: 'energy',
    condition: '10 energy logs',
    xpReward: 60,
  },
  {
    id: 'solar_advocate',
    title: 'Solar Advocate',
    description: 'Log solar energy usage 5 times',
    icon: '☀️',
    rarity: 'rare',
    category: 'energy',
    condition: '5 solar logs',
    xpReward: 80,
  },

  // Impact
  {
    id: 'carbon_cutter_10',
    title: 'Carbon Cutter',
    description: 'Save 10 kg of CO₂ compared to averages',
    icon: '✂️',
    rarity: 'uncommon',
    category: 'impact',
    condition: 'Save 10kg CO₂',
    xpReward: 70,
  },
  {
    id: 'carbon_cutter_50',
    title: 'Carbon Crusher',
    description: 'Save 50 kg of CO₂ compared to averages',
    icon: '💚',
    rarity: 'rare',
    category: 'impact',
    condition: 'Save 50kg CO₂',
    xpReward: 150,
  },
  {
    id: 'carbon_cutter_100',
    title: 'Climate Champion',
    description: 'Save 100 kg of CO₂ compared to averages',
    icon: '🏆',
    rarity: 'epic',
    category: 'impact',
    condition: 'Save 100kg CO₂',
    xpReward: 300,
  },
  {
    id: 'tree_planter',
    title: 'Virtual Forester',
    description: 'Save enough CO₂ equivalent to planting 5 trees',
    icon: '🌳',
    rarity: 'epic',
    category: 'impact',
    condition: 'Plant 5 virtual trees',
    xpReward: 200,
  },

  // Social & Special
  {
    id: 'ai_chat',
    title: 'Coach\'s Pet',
    description: 'Have 5 conversations with the AI Carbon Coach',
    icon: '🤖',
    rarity: 'uncommon',
    category: 'special',
    condition: '5 AI chats',
    xpReward: 50,
  },
  {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    rarity: 'uncommon',
    category: 'special',
    condition: 'Level 5',
    xpReward: 75,
  },
  {
    id: 'level_10',
    title: 'Eco Legend',
    description: 'Reach Level 10',
    icon: '🌟',
    rarity: 'epic',
    category: 'special',
    condition: 'Level 10',
    xpReward: 200,
  },
  {
    id: 'all_categories',
    title: 'Well-Rounded',
    description: 'Log activities in all 5 categories',
    icon: '🎯',
    rarity: 'rare',
    category: 'special',
    condition: 'All 5 categories',
    xpReward: 100,
  },
];

export const RARITY_COLORS = {
  common: { bg: 'rgba(156, 163, 175, 0.2)', border: '#9ca3af', text: '#d1d5db' },
  uncommon: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#86efac' },
  rare: { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', text: '#93c5fd' },
  epic: { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', text: '#c4b5fd' },
  legendary: { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#fcd34d' },
};

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

export function getAchievementsByCategory(category: string): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}
