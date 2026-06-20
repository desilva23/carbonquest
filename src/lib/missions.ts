export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  type: 'daily' | 'weekly' | 'bonus';
  actionText: string;
}

export const DAILY_MISSIONS: Mission[] = [
  {
    id: 'walk_commute',
    title: 'Walk the Walk',
    description: 'Walk or bike instead of driving for at least one trip today',
    icon: '🚶',
    xpReward: 30,
    difficulty: 'easy',
    category: 'transport',
    type: 'daily',
    actionText: 'Log a walking or cycling trip',
  },
  {
    id: 'plant_meal',
    title: 'Green Plate',
    description: 'Eat at least one fully plant-based meal today',
    icon: '🥗',
    xpReward: 25,
    difficulty: 'easy',
    category: 'food',
    type: 'daily',
    actionText: 'Log a vegetarian or vegan meal',
  },
  {
    id: 'no_car',
    title: 'Car-Free Champion',
    description: 'Go the entire day without using a car',
    icon: '🚫🚗',
    xpReward: 50,
    difficulty: 'medium',
    category: 'transport',
    type: 'daily',
    actionText: 'Complete a car-free day',
  },
  {
    id: 'short_shower',
    title: 'Quick Splash',
    description: 'Take a shower under 5 minutes to save water and energy',
    icon: '🚿',
    xpReward: 20,
    difficulty: 'easy',
    category: 'energy',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'no_plastic',
    title: 'Plastic-Free Hero',
    description: 'Avoid single-use plastics for the entire day',
    icon: '♻️',
    xpReward: 35,
    difficulty: 'medium',
    category: 'lifestyle',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'air_dry',
    title: 'Air Dry Day',
    description: 'Air-dry your laundry instead of using a dryer',
    icon: '👕',
    xpReward: 20,
    difficulty: 'easy',
    category: 'energy',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'public_transport',
    title: 'Transit Rider',
    description: 'Use public transportation for your commute',
    icon: '🚌',
    xpReward: 30,
    difficulty: 'easy',
    category: 'transport',
    type: 'daily',
    actionText: 'Log a public transport trip',
  },
  {
    id: 'cold_wash',
    title: 'Cold Wash Challenge',
    description: 'Wash your clothes in cold water',
    icon: '🧊',
    xpReward: 20,
    difficulty: 'easy',
    category: 'energy',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'reusable_bottle',
    title: 'Hydration Station',
    description: 'Use only a reusable water bottle today',
    icon: '🫗',
    xpReward: 15,
    difficulty: 'easy',
    category: 'lifestyle',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'leftovers',
    title: 'Zero Waste Chef',
    description: 'Use leftovers instead of cooking fresh or ordering',
    icon: '🍲',
    xpReward: 25,
    difficulty: 'easy',
    category: 'food',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'unplug_devices',
    title: 'Power Down',
    description: 'Unplug all unused electronics before bed',
    icon: '🔌',
    xpReward: 15,
    difficulty: 'easy',
    category: 'energy',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'local_food',
    title: 'Local Harvest',
    description: 'Buy food from a local market or farmer today',
    icon: '🌽',
    xpReward: 30,
    difficulty: 'medium',
    category: 'food',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'meatless',
    title: 'Meatless Monday (Any Day!)',
    description: 'Go completely meatless for all meals today',
    icon: '🌿',
    xpReward: 40,
    difficulty: 'medium',
    category: 'food',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'stairs',
    title: 'Stairway to Green',
    description: 'Take the stairs instead of the elevator all day',
    icon: '🪜',
    xpReward: 15,
    difficulty: 'easy',
    category: 'lifestyle',
    type: 'daily',
    actionText: 'Mark as completed',
  },
  {
    id: 'no_delivery',
    title: 'Cook at Home',
    description: 'Skip food delivery apps and cook at home today',
    icon: '👨‍🍳',
    xpReward: 30,
    difficulty: 'medium',
    category: 'food',
    type: 'daily',
    actionText: 'Mark as completed',
  },
];

export const WEEKLY_MISSIONS: Mission[] = [
  {
    id: 'week_no_meat',
    title: 'Veggie Week',
    description: 'Go vegetarian for 5 out of 7 days this week',
    icon: '🥬',
    xpReward: 150,
    difficulty: 'hard',
    category: 'food',
    type: 'weekly',
    actionText: 'Track your plant-based meals',
  },
  {
    id: 'week_public_transport',
    title: 'Transit Champion',
    description: 'Use public transport at least 5 times this week',
    icon: '🚉',
    xpReward: 120,
    difficulty: 'medium',
    category: 'transport',
    type: 'weekly',
    actionText: 'Log your public transport trips',
  },
  {
    id: 'week_energy_saver',
    title: 'Energy Saver',
    description: 'Reduce your energy activities by 20% compared to last week',
    icon: '💡',
    xpReward: 100,
    difficulty: 'medium',
    category: 'energy',
    type: 'weekly',
    actionText: 'Monitor your energy usage',
  },
  {
    id: 'week_walk_10k',
    title: 'Walking Champion',
    description: 'Walk or cycle at least 30km this week',
    icon: '🏃',
    xpReward: 130,
    difficulty: 'hard',
    category: 'transport',
    type: 'weekly',
    actionText: 'Log your walking and cycling',
  },
  {
    id: 'week_no_online_shopping',
    title: 'Shop Local Week',
    description: 'Avoid online shopping for the entire week',
    icon: '🏪',
    xpReward: 80,
    difficulty: 'medium',
    category: 'shopping',
    type: 'weekly',
    actionText: 'Track your shopping habits',
  },
];

export function getDailyMissions(date: string, count: number = 5): Mission[] {
  // Use date as seed for consistent daily selection
  const seed = date.split('-').reduce((acc, v) => acc + parseInt(v), 0);
  const shuffled = [...DAILY_MISSIONS].sort((a, b) => {
    const ha = ((seed * 31 + a.id.length) % 100) - 50;
    const hb = ((seed * 31 + b.id.length) % 100) - 50;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

export function getWeeklyMissions(count: number = 3): Mission[] {
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const shuffled = [...WEEKLY_MISSIONS].sort((a, b) => {
    const ha = ((weekNum * 17 + a.id.length) % 100) - 50;
    const hb = ((weekNum * 17 + b.id.length) % 100) - 50;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

export function getMissionById(id: string): Mission | undefined {
  return [...DAILY_MISSIONS, ...WEEKLY_MISSIONS].find((m) => m.id === id);
}
