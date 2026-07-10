/**
 * Arcade Game Types
 * Strict data contracts for arcade leaderboard entries
 */

export interface ArcadeLeaderboardEntry {
  id: string;
  username: string;
  gameId: string;
  highScore: number;
  achievedAt: string;
}