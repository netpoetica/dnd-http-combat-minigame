import {
    Machine
} from 'xstate';
import {
    ICharacter
} from '../types';

interface IGameContext {
    currentActor?: ICharacter;
    enemy?: ICharacter;
    player?: ICharacter;
}

const game = Machine<IGameContext>({
    id: 'game',
    initial: 'initialize',
    context: {
        currentActor: undefined,
        enemy: undefined,
        player: undefined
    },
    states: {
        initialize: {
            entry: ['beginCombat'],
            on: {
                INITIALIZED: 'showMainMenu'
            }
        },
        showMainMenu: {
            on: {
                PLAY_BTN_CLICK: 'determineNextActor'
            }
        },
        determineNextActor: {
            entry: ['getNextActor'],
            on: {
                CHOOSE_PLAYER: 'playerTurn',
                CHOOSE_ENEMY: 'enemyTurn'
            }
        },
        playerTurn: {
            on: {
                COMPLETE: 'checkWinCondition'
            }
        },
        enemyTurn: {
            entry: ['runEnemyTurn'],
            on: {
                COMPLETE: 'checkWinCondition'
            }
        },
        checkWinCondition: {
            entry: ['checkForWinner'],
            on: {
                PLAYER_WIN: 'gameOver',
                ENEMY_WIN: 'gameOver',
                NONE: 'determineNextActor',
            }
        },
        gameOver: {
            on: {
                PLAY_BTN_CLICK: 'replay'
            }
        },
        replay: {
            entry: ['clearData', 'beginCombat'],
            on: {
                INITIALIZED: 'determineNextActor'
            }
        }
    }
}, {
    // Actions will be overwritten in React component in order
    // to allow for state updates and to trigger re-render. They
    // are declared here simply for clarity to developers.
    actions: {
        // tslint:disable no-empty
        beginCombat: async () => {},
        clearData: async () => {},
        getNextActor: () => {},
        checkForWinner: () => {},
        runEnemyTurn: () => {}
        // tslint:enable no-empty
    }
});

export default game;