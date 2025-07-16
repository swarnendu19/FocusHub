import { describe, it, expect } from 'vitest';
import {
    calculateLevel,
    getXPForLevel,
    getCurrentLevelXP,
    getXPToNextLevel,
    getLevelProgress,
    calculateTaskXP,
} from '../xp';

describe('XP Utilities', () => {
    describe('calculateLevel', () => {
        it('should calculate correct level for given XP', () => {
            expect(calculateLevel(0)).toBe(1);
            expect(calculateLevel(100)).toBe(2);
            expect(calculateLevel(400)).toBe(3);
            expect(calculateLevel(900)).toBe(4);
        });
    });

    describe('getXPForLevel', () => {
        it('should return correct XP required for level', () => {
            expect(getXPForLevel(1)).toBe(0);
            expect(getXPForLevel(2)).toBe(100);
            expect(getXPForLevel(3)).toBe(400);
            expect(getXPForLevel(4)).toBe(900);
        });
    });

    describe('getCurrentLevelXP', () => {
        it('should return XP within current level', () => {
            expect(getCurrentLevelXP(150)).toBe(50); // Level 2, 50 XP into level
            expect(getCurrentLevelXP(450)).toBe(50); // Level 3, 50 XP into level
        });
    });

    describe('getXPToNextLevel', () => {
        it('should return XP needed for next level', () => {
            expect(getXPToNextLevel(150)).toBe(250); // Need 250 more XP to reach level 3
            expect(getXPToNextLevel(450)).toBe(450); // Need 450 more XP to reach level 4
        });
    });

    describe('getLevelProgress', () => {
        it('should return progress percentage within current level', () => {
            // Level 2 starts at 100 XP and needs 300 XP to reach level 3 (400 total)
            // So 150 XP = 50 XP into level 2, which is 50/300 = 16.67%
            expect(getLevelProgress(150)).toBeCloseTo(16.67, 1);
            // 250 XP = 150 XP into level 2, which is 150/300 = 50%
            expect(getLevelProgress(250)).toBeCloseTo(50, 1);
        });
    });

    describe('calculateTaskXP', () => {
        it('should calculate XP based on time and difficulty', () => {
            const oneMinute = 60000;
            expect(calculateTaskXP(oneMinute, 'easy')).toBe(1);
            expect(calculateTaskXP(oneMinute, 'medium')).toBe(1);
            expect(calculateTaskXP(oneMinute, 'hard')).toBe(2);
        });
    });
});