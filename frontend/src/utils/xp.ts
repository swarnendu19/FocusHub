// XP and level calculation utilities

export const calculateLevel = (totalXP: number): number => {
    // Level formula: level = floor(sqrt(totalXP / 100))
    // This means level 1 = 100 XP, level 2 = 400 XP, level 3 = 900 XP, etc.
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

export const getXPForLevel = (level: number): number => {
    // XP required to reach a specific level
    return (level - 1) ** 2 * 100;
};

export const getXPForNextLevel = (currentLevel: number): number => {
    return getXPForLevel(currentLevel + 1);
};

export const getCurrentLevelXP = (totalXP: number): number => {
    const currentLevel = calculateLevel(totalXP);
    const currentLevelStartXP = getXPForLevel(currentLevel);
    return totalXP - currentLevelStartXP;
};

export const getXPToNextLevel = (totalXP: number): number => {
    const currentLevel = calculateLevel(totalXP);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    return nextLevelXP - totalXP;
};

export const getLevelProgress = (totalXP: number): number => {
    const currentLevel = calculateLevel(totalXP);
    const currentLevelStartXP = getXPForLevel(currentLevel);
    const nextLevelXP = getXPForNextLevel(currentLevel);
    const currentLevelXP = totalXP - currentLevelStartXP;
    const xpNeededForLevel = nextLevelXP - currentLevelStartXP;

    return Math.min((currentLevelXP / xpNeededForLevel) * 100, 100);
};

export const calculateTaskXP = (timeSpentMs: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium'): number => {
    const baseXP = Math.floor(timeSpentMs / 60000); // 1 XP per minute
    const multipliers = {
        easy: 1,
        medium: 1.5,
        hard: 2,
    };

    return Math.floor(baseXP * multipliers[difficulty]);
};

export const calculateStreakBonus = (streakDays: number): number => {
    // Bonus XP for maintaining streaks
    if (streakDays >= 30) return 50;
    if (streakDays >= 14) return 25;
    if (streakDays >= 7) return 10;
    if (streakDays >= 3) return 5;
    return 0;
};

export const getAchievementXP = (rarity: 'common' | 'rare' | 'epic' | 'legendary'): number => {
    const xpValues = {
        common: 50,
        rare: 100,
        epic: 250,
        legendary: 500,
    };

    return xpValues[rarity];
};