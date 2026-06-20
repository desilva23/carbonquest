export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  totalCO2Saved: number;
  streak: number;
  rank?: number;
}

// Simulated leaderboard users with realistic scores
const SIMULATED_USERS: Omit<LeaderboardUser, 'rank'>[] = [
  { id: 'u1', name: 'Aarav Sharma', avatar: '🌳', level: 12, xp: 4200, totalCO2Saved: 342, streak: 28 },
  { id: 'u2', name: 'Priya Patel', avatar: '🌻', level: 11, xp: 3800, totalCO2Saved: 298, streak: 21 },
  { id: 'u3', name: 'Rahul Kumar', avatar: '🦋', level: 10, xp: 3400, totalCO2Saved: 256, streak: 14 },
  { id: 'u4', name: 'Sneha Gupta', avatar: '🌿', level: 9, xp: 2900, totalCO2Saved: 223, streak: 19 },
  { id: 'u5', name: 'Arjun Singh', avatar: '🐝', level: 9, xp: 2750, totalCO2Saved: 210, streak: 12 },
  { id: 'u6', name: 'Kavya Nair', avatar: '🌎', level: 8, xp: 2400, totalCO2Saved: 187, streak: 16 },
  { id: 'u7', name: 'Vikram Reddy', avatar: '🌲', level: 8, xp: 2200, totalCO2Saved: 165, streak: 10 },
  { id: 'u8', name: 'Ananya Iyer', avatar: '🦜', level: 7, xp: 1900, totalCO2Saved: 142, streak: 8 },
  { id: 'u9', name: 'Dev Mehta', avatar: '🐢', level: 7, xp: 1750, totalCO2Saved: 128, streak: 11 },
  { id: 'u10', name: 'Riya Desai', avatar: '🌱', level: 6, xp: 1500, totalCO2Saved: 105, streak: 7 },
  { id: 'u11', name: 'Karan Joshi', avatar: '🍀', level: 6, xp: 1350, totalCO2Saved: 95, streak: 9 },
  { id: 'u12', name: 'Meera Rao', avatar: '🌺', level: 5, xp: 1100, totalCO2Saved: 78, streak: 5 },
  { id: 'u13', name: 'Aditya Verma', avatar: '🌿', level: 5, xp: 950, totalCO2Saved: 64, streak: 6 },
  { id: 'u14', name: 'Pooja Bhat', avatar: '🌸', level: 4, xp: 750, totalCO2Saved: 48, streak: 4 },
  { id: 'u15', name: 'Nikhil Agarwal', avatar: '🌴', level: 4, xp: 600, totalCO2Saved: 35, streak: 3 },
  { id: 'u16', name: 'Ishita Kapoor', avatar: '🦋', level: 3, xp: 450, totalCO2Saved: 22, streak: 3 },
  { id: 'u17', name: 'Siddharth Das', avatar: '🌍', level: 3, xp: 350, totalCO2Saved: 18, streak: 2 },
  { id: 'u18', name: 'Tanvi Choudhary', avatar: '🌻', level: 2, xp: 200, totalCO2Saved: 10, streak: 2 },
  { id: 'u19', name: 'Rohan Mishra', avatar: '🍃', level: 2, xp: 150, totalCO2Saved: 8, streak: 1 },
  { id: 'u20', name: 'Divya Saxena', avatar: '🌼', level: 1, xp: 75, totalCO2Saved: 3, streak: 1 },
];

export function getLeaderboard(
  currentUser: { name: string; avatar: string; level: number; xp: number; totalCO2Saved: number; streak: number } | null,
  sortBy: 'xp' | 'co2' | 'streak' = 'xp'
): LeaderboardUser[] {
  const users: LeaderboardUser[] = SIMULATED_USERS.map((u) => ({ ...u }));

  if (currentUser) {
    users.push({
      id: 'current_user',
      name: currentUser.name,
      avatar: currentUser.avatar,
      level: currentUser.level,
      xp: currentUser.xp,
      totalCO2Saved: currentUser.totalCO2Saved,
      streak: currentUser.streak,
    });
  }

  // Sort
  users.sort((a, b) => {
    switch (sortBy) {
      case 'co2':
        return b.totalCO2Saved - a.totalCO2Saved;
      case 'streak':
        return b.streak - a.streak;
      case 'xp':
      default:
        return b.xp - a.xp;
    }
  });

  // Add ranks
  return users.map((u, i) => ({ ...u, rank: i + 1 }));
}
