import { Skill, SkillTreeState, SkillBenefitType } from '@/types/skills';

export class SkillTreeService {
    /**
     * Calculate the total XP multiplier from all unlocked skills
     */
    static calculateXPMultiplier(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const xpBenefits = skill.benefits.filter(benefit => benefit.type === 'xp_multiplier');
                const skillMultiplier = xpBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillMultiplier;
            }, 0);
    }

    /**
     * Calculate the focus duration bonus from all unlocked skills
     */
    static calculateFocusDurationBonus(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const focusBenefits = skill.benefits.filter(benefit => benefit.type === 'focus_duration');
                const skillBonus = focusBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillBonus;
            }, 0);
    }

    /**
     * Calculate the streak protection days from all unlocked skills
     */
    static calculateStreakProtection(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const streakBenefits = skill.benefits.filter(benefit => benefit.type === 'streak_protection');
                const skillProtection = streakBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillProtection;
            }, 0);
    }

    /**
     * Calculate the task efficiency bonus from all unlocked skills
     */
    static calculateTaskEfficiencyBonus(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const efficiencyBenefits = skill.benefits.filter(benefit => benefit.type === 'task_efficiency');
                const skillBonus = efficiencyBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillBonus;
            }, 0);
    }

    /**
     * Calculate the achievement boost from all unlocked skills
     */
    static calculateAchievementBoost(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const achievementBenefits = skill.benefits.filter(benefit => benefit.type === 'achievement_boost');
                const skillBonus = achievementBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillBonus;
            }, 0);
    }

    /**
     * Calculate bonus XP from all unlocked skills
     */
    static calculateBonusXP(skills: Record<string, Skill>): number {
        return Object.values(skills)
            .filter(skill => skill.level > 0)
            .reduce((total, skill) => {
                const bonusBenefits = skill.benefits.filter(benefit => benefit.type === 'bonus_xp');
                const skillBonus = bonusBenefits.reduce((sum, benefit) => {
                    return sum + (benefit.value * skill.level);
                }, 0);
                return total + skillBonus;
            }, 0);
    }

    /**
     * Check if a skill can be upgraded based on prerequisites and resources
     */
    static canUpgradeSkill(
        skillId: string,
        skills: Record<string, Skill>,
        skillPoints: number
    ): boolean {
        const skill = skills[skillId];
        if (!skill) return false;

        // Check if skill is at max level
        if (skill.level >= skill.maxLevel) return false;

        // Check if we have enough skill points
        if (skillPoints < skill.xpCost) return false;

        // Check if all required skills are unlocked
        return skill.requiredSkills.every(reqSkillId => {
            const reqSkill = skills[reqSkillId];
            return reqSkill && reqSkill.level > 0;
        });
    }

    /**
     * Get all skills that are currently available for upgrade
     */
    static getAvailableSkills(skills: Record<string, Skill>, skillPoints: number): Skill[] {
        return Object.values(skills).filter(skill =>
            this.canUpgradeSkill(skill.id, skills, skillPoints)
        );
    }

    /**
     * Get all unlocked skills
     */
    static getUnlockedSkills(skills: Record<string, Skill>): Skill[] {
        return Object.values(skills).filter(skill => skill.level > 0);
    }

    /**
     * Calculate the total skill points spent
     */
    static calculateSkillPointsSpent(skills: Record<string, Skill>): number {
        return Object.values(skills).reduce((total, skill) => {
            return total + (skill.level * skill.xpCost);
        }, 0);
    }

    /**
     * Get skills by category
     */
    static getSkillsByCategory(skills: Record<string, Skill>, category: Skill['category']): Skill[] {
        return Object.values(skills).filter(skill => skill.category === category);
    }

    /**
     * Calculate skill tree completion percentage
     */
    static calculateCompletionPercentage(skills: Record<string, Skill>): number {
        const totalSkills = Object.keys(skills).length;
        const unlockedSkills = this.getUnlockedSkills(skills).length;
        return totalSkills > 0 ? (unlockedSkills / totalSkills) * 100 : 0;
    }

    /**
     * Get the next recommended skill to upgrade
     */
    static getRecommendedSkill(skills: Record<string, Skill>, skillPoints: number): Skill | null {
        const availableSkills = this.getAvailableSkills(skills, skillPoints);

        if (availableSkills.length === 0) return null;

        // Prioritize skills with lower cost first (easier to unlock)
        return availableSkills.sort((a, b) => a.xpCost - b.xpCost)[0];
    }

    /**
     * Apply skill benefits to a base value
     */
    static applySkillBenefits(
        baseValue: number,
        benefitType: SkillBenefitType,
        skills: Record<string, Skill>
    ): number {
        let multiplier = 1;
        let bonus = 0;

        Object.values(skills)
            .filter(skill => skill.level > 0)
            .forEach(skill => {
                skill.benefits
                    .filter(benefit => benefit.type === benefitType)
                    .forEach(benefit => {
                        if (benefitType === 'xp_multiplier') {
                            multiplier += (benefit.value * skill.level) / 100;
                        } else {
                            bonus += benefit.value * skill.level;
                        }
                    });
            });

        return benefitType === 'xp_multiplier' ? baseValue * multiplier : baseValue + bonus;
    }

    /**
     * Generate skill tree statistics
     */
    static generateSkillTreeStats(skills: Record<string, Skill>, skillPoints: number) {
        const unlockedSkills = this.getUnlockedSkills(skills);
        const availableSkills = this.getAvailableSkills(skills, skillPoints);
        const spentPoints = this.calculateSkillPointsSpent(skills);
        const completionPercentage = this.calculateCompletionPercentage(skills);

        return {
            totalSkills: Object.keys(skills).length,
            unlockedSkills: unlockedSkills.length,
            availableSkills: availableSkills.length,
            skillPointsSpent: spentPoints,
            skillPointsAvailable: skillPoints,
            completionPercentage,
            benefits: {
                xpMultiplier: this.calculateXPMultiplier(skills),
                focusDurationBonus: this.calculateFocusDurationBonus(skills),
                streakProtection: this.calculateStreakProtection(skills),
                taskEfficiencyBonus: this.calculateTaskEfficiencyBonus(skills),
                achievementBoost: this.calculateAchievementBoost(skills),
                bonusXP: this.calculateBonusXP(skills)
            }
        };
    }

    /**
     * Validate skill tree state for consistency
     */
    static validateSkillTreeState(skillTreeState: SkillTreeState): {
        isValid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];
        const { skills, skillPoints, activeSkills } = skillTreeState;

        // Check if all active skills are actually unlocked
        activeSkills.forEach(skillId => {
            const skill = skills[skillId];
            if (!skill || skill.level === 0) {
                errors.push(`Active skill ${skillId} is not unlocked`);
            }
        });

        // Check if skill prerequisites are met
        Object.values(skills).forEach(skill => {
            if (skill.level > 0) {
                skill.requiredSkills.forEach(reqSkillId => {
                    const reqSkill = skills[reqSkillId];
                    if (!reqSkill || reqSkill.level === 0) {
                        errors.push(`Skill ${skill.id} is unlocked but prerequisite ${reqSkillId} is not`);
                    }
                });
            }
        });

        // Check if skill levels are within bounds
        Object.values(skills).forEach(skill => {
            if (skill.level < 0 || skill.level > skill.maxLevel) {
                errors.push(`Skill ${skill.id} has invalid level: ${skill.level} (max: ${skill.maxLevel})`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}