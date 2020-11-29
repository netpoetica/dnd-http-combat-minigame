import {
    ICombatResponse
} from '../types/';
import {
    log
} from './utils/log';
import {
    waitForMs
} from './utils/waitForMs';
import {
    action
} from './scene';
import {
    attack
} from './api';

export const beginCombat = async (context, send) => {
    log('-> action: beginCombat...');

    const response = await fetch('/api/initialize');
    const parsed: ICombatResponse = await response.json();

    context.enemy = parsed.combatants.enemy;
    context.player = parsed.combatants.player;

    log(`-> Initial stats (beginCombat):
        Player HP: ${context.player.currentHitPoints}
        Enemy HP: ${context.enemy.currentHitPoints}
    `);

    send({
        type: 'INITIALIZED'
    });
};

export const clearData = async (context) => {
    log('-> action: clearData...');
    context.currentActor = undefined;
    context.enemy = undefined;
    context.player = undefined;
};

export const getNextActor = (context, send) => {
    log('-> action: getNextActor...');
    log('-> Determining actor...');
    const {
        currentActor,
        enemy,
        player
    } = context;

    if (!currentActor) {
        const actors =  [
            player,
            enemy
        ];
        const firstActor  = actors[Math.floor(Math.random() * actors.length)]!;

        context.currentActor = firstActor;

        log('-> Transitioning from determineNextActor to first turn...');

        send({
            type: firstActor.id ===  player!.id ? 'CHOOSE_PLAYER' : 'CHOOSE_ENEMY'
        });
    } else if (currentActor.id === player!.id) {
        context.currentActor = enemy;

        log('-> Transitioning from determineNextActor to enemy turn...');

        send({
            type: 'CHOOSE_ENEMY'
        });
    } else if (currentActor.id === enemy!.id) {
        context.currentActor = player;

        log('-> Transitioning from determineNextActor to player turn...');

        send({
            type: 'CHOOSE_PLAYER'
        });
    }
};

export const checkForWinner = (context, send) => {
    const {
        enemy,
        player
    } = context;

    log('-> action: checkForWinner...');
    log(`-> Stats (checkForWinner)
        Player HP: ${player?.currentHitPoints}
        Enemy HP: ${enemy?.currentHitPoints}
    `);

    if (player!.currentHitPoints <= 0) {
        log('-> Transitioning from checkWinCondition to enemyWin...');
        send({
            type: 'ENEMY_WIN'
        });
    } else if (enemy!.currentHitPoints <= 0) {
        log('-> Transitioning from checkWinCondition to playerWin...');
        send({
            type: 'PLAYER_WIN'
        });
    } else {
        log('-> Transitioning from checkWinCondition to determineNextActor...');
        send({
            type: 'NONE'
        });
    }
};

export const runEnemyTurn = async (context, send) => {
    const {
        player
    } = context;

    log('-> action: runEnemyTurn...');

    // Play goblin punch animation
    action?.play();

    const results = await attack(player!);

    // Add wait time so it "feels" like the punch finishes before the user loses life
    await waitForMs(1500);

    context.player = results.targetData;

    // stop goblin punch animation, transition to next state
    action?.stop();
    log('-> Transitioning from enemyTurn to checkWinCondition...');

    send({
        type: 'COMPLETE'
    });
};