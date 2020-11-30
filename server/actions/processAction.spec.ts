import {
    processAddTempHP,
    processDealDamage,
    processHealHP
} from './processAction';
import {
    DamageType,
    DefenseType
} from '../../types/enums';

import * as Character from '../models/Character';

describe('processAction', () => {
    describe('processAddTempHP', () => {
        it('should be able to add temporary hit points when none exist', () => {
            const char = Character.generateRandom();
            const temporaryHitPoints = 10;
            processAddTempHP({
                target: char,
                temporaryHitPoints
            });
            expect(char.temporaryHitPoints).toEqual(temporaryHitPoints);
        });
        it('should not add temporary hit points when more exist than candidate value', () => {
            const char = Character.generateRandom();
            // Emulate char has 15 temp HP.
            const initialTempHitPoints = 15;
            char.temporaryHitPoints = initialTempHitPoints;
            // Try to give 10 HP.
            const temporaryHitPoints = 10;
            processAddTempHP({
                target: char,
                temporaryHitPoints
            });
            // Should be the same as initial.
            expect(char.temporaryHitPoints).toEqual(initialTempHitPoints);
        });
    });
    describe('processDealDamage', () => {
        describe('base HP', () => {
            it('should deal damage to character', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Bludgeoning, 5]
                    ]
                });
                expect(char.currentHitPoints).toEqual(5);
            });
            it('should not let damage put character below 0', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Bludgeoning, 50]
                    ]
                });
                expect(char.currentHitPoints).toEqual(0);
            });
            it('should deal 1/2 damage to character with resistance', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                char.defenses.push({
                    damageType: DamageType.Fire,
                    defenseType: DefenseType.Resistance
                });
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Fire, 10]
                    ]
                });
                expect(char.currentHitPoints).toEqual(5);
            });
            it('should deal no damage to character with immunity', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                char.defenses.push({
                    damageType: DamageType.Fire,
                    defenseType: DefenseType.Immunity
                });
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Fire, 10]
                    ]
                });
                expect(char.currentHitPoints).toEqual(10);
            });
            it('should deal double damage to character with vulnerability', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                char.vulnerabilities.push(DamageType.Fire);
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Fire, 5]
                    ]
                });
                expect(char.currentHitPoints).toEqual(0);
            });
            it('should apply multiple damage types to character', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 30;
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Bludgeoning, 5],
                        [DamageType.Slashing, 5],
                        [DamageType.Piercing, 5]
                    ]
                });
                expect(char.currentHitPoints).toEqual(15);
            });
        });
        describe('temp HP', () => {
            it('should deal no damage to character\'s base HP when has enough temp HP', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                char.temporaryHitPoints = 10;
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Bludgeoning, 5]
                    ]
                });
                expect(char.temporaryHitPoints).toEqual(5);
                expect(char.currentHitPoints).toEqual(10);
            });
            it('should deal excess damage to character\'s base HP when not enough temp HP', () => {
                const char = Character.generateRandom();
                char.currentHitPoints = 10;
                char.temporaryHitPoints = 1;
                processDealDamage({
                    target: char,
                    damagePoints: [
                        [DamageType.Bludgeoning, 5]
                    ]
                });
                expect(char.temporaryHitPoints).toEqual(0);
                expect(char.currentHitPoints).toEqual(6);
            });
        });
    });
    describe('processHealHP', () => {
        it('should heal damage to character', () => {
            const char = Character.generateRandom();
            char.maxHitPoints = 100;
            char.currentHitPoints = 10;
            processHealHP({
                target: char,
                totalHitPoints: 50
            });
            expect(char.currentHitPoints).toEqual(60);
        });
        it('should not heal past max hit points', () => {
            const char = Character.generateRandom();
            char.maxHitPoints = 100;
            char.currentHitPoints = 90;
            processHealHP({
                target: char,
                totalHitPoints: 50
            });
            expect(char.currentHitPoints).toEqual(100);
        });
    });
});