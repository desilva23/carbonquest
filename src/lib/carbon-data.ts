// Carbon emission factors (kg CO2 equivalent)
// Sources: EPA, DEFRA 2023, Our World in Data

export interface EmissionFactor {
  id: string;
  category: 'transport' | 'food' | 'energy' | 'shopping' | 'lifestyle';
  name: string;
  icon: string;
  unit: string;
  kgCO2PerUnit: number;
  description: string;
  tips: string[];
}

export const EMISSION_FACTORS: EmissionFactor[] = [
  // Transport (per km)
  {
    id: 'car_petrol',
    category: 'transport',
    name: 'Car (Petrol)',
    icon: '🚗',
    unit: 'km',
    kgCO2PerUnit: 0.192,
    description: 'Average petrol car emissions',
    tips: ['Carpool to cut emissions by 50%', 'Consider switching to electric'],
  },
  {
    id: 'car_diesel',
    category: 'transport',
    name: 'Car (Diesel)',
    icon: '🚙',
    unit: 'km',
    kgCO2PerUnit: 0.171,
    description: 'Average diesel car emissions',
    tips: ['Keep tires inflated to improve fuel efficiency', 'Drive at steady speeds'],
  },
  {
    id: 'car_electric',
    category: 'transport',
    name: 'Car (Electric)',
    icon: '⚡',
    unit: 'km',
    kgCO2PerUnit: 0.053,
    description: 'Electric vehicle (grid average)',
    tips: ['Charge during off-peak hours', 'Use regenerative braking'],
  },
  {
    id: 'bus',
    category: 'transport',
    name: 'Bus',
    icon: '🚌',
    unit: 'km',
    kgCO2PerUnit: 0.089,
    description: 'Public bus per passenger',
    tips: ['Great choice! 75% less than driving alone'],
  },
  {
    id: 'train',
    category: 'transport',
    name: 'Train',
    icon: '🚆',
    unit: 'km',
    kgCO2PerUnit: 0.041,
    description: 'National rail per passenger',
    tips: ['One of the greenest transport options!'],
  },
  {
    id: 'metro',
    category: 'transport',
    name: 'Metro/Subway',
    icon: '🚇',
    unit: 'km',
    kgCO2PerUnit: 0.033,
    description: 'Urban metro per passenger',
    tips: ['Ultra-low emissions transport!'],
  },
  {
    id: 'bicycle',
    category: 'transport',
    name: 'Bicycle',
    icon: '🚲',
    unit: 'km',
    kgCO2PerUnit: 0.0,
    description: 'Zero direct emissions!',
    tips: ['Perfect choice! Zero emissions and great exercise'],
  },
  {
    id: 'walk',
    category: 'transport',
    name: 'Walking',
    icon: '🚶',
    unit: 'km',
    kgCO2PerUnit: 0.0,
    description: 'Zero emissions!',
    tips: ['The greenest way to travel!'],
  },
  {
    id: 'flight_domestic',
    category: 'transport',
    name: 'Domestic Flight',
    icon: '✈️',
    unit: 'km',
    kgCO2PerUnit: 0.255,
    description: 'Short-haul flight per passenger',
    tips: ['Consider trains for distances under 500km', 'Offset your flight emissions'],
  },
  {
    id: 'flight_international',
    category: 'transport',
    name: 'International Flight',
    icon: '🌍',
    unit: 'km',
    kgCO2PerUnit: 0.195,
    description: 'Long-haul flight per passenger',
    tips: ['Fly direct — takeoff uses the most fuel', 'Choose economy class'],
  },
  {
    id: 'motorcycle',
    category: 'transport',
    name: 'Motorcycle',
    icon: '🏍️',
    unit: 'km',
    kgCO2PerUnit: 0.113,
    description: 'Average motorcycle',
    tips: ['More efficient than cars but consider electric alternatives'],
  },
  {
    id: 'rideshare',
    category: 'transport',
    name: 'Ride Share (Uber/Ola)',
    icon: '📱',
    unit: 'km',
    kgCO2PerUnit: 0.21,
    description: 'Ride-hailing service',
    tips: ['Share rides with others', 'Choose pool/shared options when available'],
  },

  // Food (per serving/meal)
  {
    id: 'beef_meal',
    category: 'food',
    name: 'Beef Meal',
    icon: '🥩',
    unit: 'serving',
    kgCO2PerUnit: 6.61,
    description: 'One beef-based meal',
    tips: ['Beef has 10x the emissions of chicken', 'Try Meatless Mondays'],
  },
  {
    id: 'lamb_meal',
    category: 'food',
    name: 'Lamb Meal',
    icon: '🍖',
    unit: 'serving',
    kgCO2PerUnit: 5.84,
    description: 'One lamb-based meal',
    tips: ['Consider replacing with plant-based protein once a week'],
  },
  {
    id: 'chicken_meal',
    category: 'food',
    name: 'Chicken Meal',
    icon: '🍗',
    unit: 'serving',
    kgCO2PerUnit: 1.82,
    description: 'One chicken-based meal',
    tips: ['Much lower impact than beef — good swap!'],
  },
  {
    id: 'fish_meal',
    category: 'food',
    name: 'Fish Meal',
    icon: '🐟',
    unit: 'serving',
    kgCO2PerUnit: 1.34,
    description: 'One fish-based meal',
    tips: ['Choose sustainably sourced fish'],
  },
  {
    id: 'vegetarian_meal',
    category: 'food',
    name: 'Vegetarian Meal',
    icon: '🥗',
    unit: 'serving',
    kgCO2PerUnit: 0.86,
    description: 'Vegetarian meal with dairy/eggs',
    tips: ['Great choice! 85% less than beef'],
  },
  {
    id: 'vegan_meal',
    category: 'food',
    name: 'Vegan Meal',
    icon: '🌱',
    unit: 'serving',
    kgCO2PerUnit: 0.45,
    description: 'Fully plant-based meal',
    tips: ['Lowest food carbon footprint! Amazing choice!'],
  },
  {
    id: 'fast_food',
    category: 'food',
    name: 'Fast Food Meal',
    icon: '🍔',
    unit: 'serving',
    kgCO2PerUnit: 3.5,
    description: 'Typical fast food meal',
    tips: ['High emissions from processing and packaging', 'Cook at home to cut emissions by 60%'],
  },
  {
    id: 'coffee',
    category: 'food',
    name: 'Coffee',
    icon: '☕',
    unit: 'cup',
    kgCO2PerUnit: 0.21,
    description: 'One cup of coffee',
    tips: ['Choose local roasters', 'Bring a reusable cup'],
  },
  {
    id: 'dairy_milk',
    category: 'food',
    name: 'Dairy Milk',
    icon: '🥛',
    unit: 'liter',
    kgCO2PerUnit: 1.39,
    description: 'One liter of dairy milk',
    tips: ['Oat milk produces 80% less CO2', 'Try plant-based alternatives'],
  },
  {
    id: 'plant_milk',
    category: 'food',
    name: 'Plant-based Milk',
    icon: '🌾',
    unit: 'liter',
    kgCO2PerUnit: 0.36,
    description: 'One liter of oat/soy/almond milk',
    tips: ['Great swap from dairy — 75% less emissions!'],
  },

  // Energy (per unit)
  {
    id: 'electricity',
    category: 'energy',
    name: 'Electricity',
    icon: '💡',
    unit: 'kWh',
    kgCO2PerUnit: 0.82,
    description: 'Indian grid electricity (avg)',
    tips: ['Switch to LED bulbs — 75% less energy', 'Turn off devices when not in use'],
  },
  {
    id: 'natural_gas',
    category: 'energy',
    name: 'Natural Gas (Cooking)',
    icon: '🔥',
    unit: 'kg',
    kgCO2PerUnit: 2.75,
    description: 'LPG/Natural gas for cooking',
    tips: ['Use pressure cookers to reduce cooking time', 'Switch to induction if possible'],
  },
  {
    id: 'solar_energy',
    category: 'energy',
    name: 'Solar Energy',
    icon: '☀️',
    unit: 'kWh',
    kgCO2PerUnit: 0.05,
    description: 'Rooftop solar panel electricity',
    tips: ['Amazing! Near-zero emissions energy!'],
  },
  {
    id: 'ac_usage',
    category: 'energy',
    name: 'Air Conditioning',
    icon: '❄️',
    unit: 'hour',
    kgCO2PerUnit: 1.23,
    description: 'Average AC unit per hour',
    tips: ['Set AC to 24°C — saves 6% energy per degree', 'Use fans when possible'],
  },
  {
    id: 'heating',
    category: 'energy',
    name: 'Heating',
    icon: '🌡️',
    unit: 'hour',
    kgCO2PerUnit: 1.45,
    description: 'Gas/electric heating per hour',
    tips: ['Lower thermostat by 1°C to save 10%', 'Wear warm clothes indoors'],
  },

  // Shopping & Lifestyle
  {
    id: 'new_clothing',
    category: 'shopping',
    name: 'New Clothing Item',
    icon: '👕',
    unit: 'item',
    kgCO2PerUnit: 10.0,
    description: 'Average new garment',
    tips: ['Buy second-hand to save ~90% emissions', 'Choose quality over quantity'],
  },
  {
    id: 'new_phone',
    category: 'shopping',
    name: 'New Smartphone',
    icon: '📱',
    unit: 'item',
    kgCO2PerUnit: 70.0,
    description: 'Manufacturing a new smartphone',
    tips: ['Keep your phone for 3+ years', 'Consider refurbished devices'],
  },
  {
    id: 'new_laptop',
    category: 'shopping',
    name: 'New Laptop',
    icon: '💻',
    unit: 'item',
    kgCO2PerUnit: 300.0,
    description: 'Manufacturing a new laptop',
    tips: ['Extend your laptop life to 5+ years', 'Choose energy-efficient models'],
  },
  {
    id: 'online_shopping',
    category: 'shopping',
    name: 'Online Order (Delivery)',
    icon: '📦',
    unit: 'order',
    kgCO2PerUnit: 0.5,
    description: 'Delivery emissions per package',
    tips: ['Combine orders to reduce deliveries', 'Choose slower shipping options'],
  },
  {
    id: 'streaming',
    category: 'lifestyle',
    name: 'Video Streaming',
    icon: '📺',
    unit: 'hour',
    kgCO2PerUnit: 0.036,
    description: 'HD streaming per hour',
    tips: ['Download for offline viewing', 'Lower resolution when possible'],
  },
  {
    id: 'laundry_hot',
    category: 'lifestyle',
    name: 'Laundry (Hot Water)',
    icon: '🧺',
    unit: 'load',
    kgCO2PerUnit: 2.4,
    description: 'Hot water wash cycle',
    tips: ['Cold water wash saves 90% energy!', 'Air-dry instead of using dryer'],
  },
  {
    id: 'laundry_cold',
    category: 'lifestyle',
    name: 'Laundry (Cold Water)',
    icon: '🧊',
    unit: 'load',
    kgCO2PerUnit: 0.24,
    description: 'Cold water wash cycle',
    tips: ['Great choice! 90% less energy than hot wash'],
  },
];

export const CATEGORIES = [
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { id: 'food', name: 'Food & Diet', icon: '🍽️', color: '#f59e0b' },
  { id: 'energy', name: 'Energy', icon: '⚡', color: '#ef4444' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🏠', color: '#10b981' },
] as const;

export type Category = (typeof CATEGORIES)[number]['id'];

export function getFactorsByCategory(category: Category): EmissionFactor[] {
  return EMISSION_FACTORS.filter((f) => f.category === category);
}

export function getFactorById(id: string): EmissionFactor | undefined {
  return EMISSION_FACTORS.find((f) => f.id === id);
}

// Context comparisons for making CO2 numbers relatable
export const CO2_COMPARISONS = [
  { threshold: 0.1, text: 'charging your phone 12 times', icon: '🔋' },
  { threshold: 0.5, text: 'a 5km car ride', icon: '🚗' },
  { threshold: 1, text: 'a tree absorbing CO2 for 2 days', icon: '🌳' },
  { threshold: 2, text: 'burning 1 liter of petrol', icon: '⛽' },
  { threshold: 5, text: 'a 30km car journey', icon: '🛣️' },
  { threshold: 10, text: 'a domestic flight of 50km', icon: '✈️' },
  { threshold: 25, text: 'heating a home for a week', icon: '🏠' },
  { threshold: 50, text: 'driving 260km in a petrol car', icon: '🚙' },
  { threshold: 100, text: 'a round-trip domestic flight', icon: '🛫' },
  { threshold: 500, text: 'an international round-trip flight', icon: '🌍' },
];

export function getCO2Comparison(kgCO2: number): { text: string; icon: string } {
  const comparison = CO2_COMPARISONS.find((c) => kgCO2 <= c.threshold);
  if (comparison) {
    const ratio = (kgCO2 / comparison.threshold).toFixed(1);
    return { text: `about ${ratio}x ${comparison.text}`, icon: comparison.icon };
  }
  const trees = Math.round(kgCO2 / 21); // A tree absorbs ~21kg CO2/year
  return { text: `what ${trees} trees absorb in a year`, icon: '🌲' };
}

// National averages for comparison (kg CO2 per day)
export const NATIONAL_AVERAGES = {
  india: 5.2,
  usa: 44.0,
  uk: 14.5,
  china: 21.1,
  germany: 22.7,
  global: 13.1,
};

// Scoring system
export function calculateEcoScore(dailyKgCO2: number): number {
  // Score from 0-100, where lower emissions = higher score
  const globalAvg = NATIONAL_AVERAGES.global;
  if (dailyKgCO2 <= 0) return 100;
  if (dailyKgCO2 >= globalAvg * 2) return 0;
  return Math.round(Math.max(0, Math.min(100, (1 - dailyKgCO2 / (globalAvg * 2)) * 100)));
}
