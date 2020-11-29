
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import {
    init,
    animate
} from './scene';
import game from './game';
import {
    useMachine,
} from '@xstate/react';
import {
    log
} from './utils/log';
import {
    attack,
    castSpell,
    heal,
    requestBoon
} from './api';
import {
    beginCombat,
    checkForWinner,
    clearData,
    getNextActor,
    runEnemyTurn
} from './actions';

const Application: React.FC = () => {
    //  Use state machine
    const [ machine, send ] = useMachine(game, {
        // Actions need accesss to machine's send function in order to transition
        // after asynchronous processing.
        actions: {
            beginCombat: (context) => beginCombat(context, send),
            clearData: (context) => clearData(context),
            getNextActor: (context) => getNextActor(context, send),
            checkForWinner: (context) => checkForWinner(context, send),
            runEnemyTurn: (context) => runEnemyTurn(context, send)
        }
    });

    const {
        enemy,
        player
    } = machine.context;

    let headerLabel = '"Give me your wallet!", the Goblin says!';
    switch (machine.value) {
        case 'playerTurn':
            headerLabel = 'Your turn!';
            break;
        case 'enemyTurn':
            headerLabel = 'Goblin\'s turn - watch out!';
            break;
        case 'gameOver':
            if (player) {
                headerLabel = player.currentHitPoints <= 0
                    ? 'You\'re dead O_O'
                    : 'You win!';
            }
            break;
    }

    return (<>
        {/* Only show main menu/overlay when game loop is not active */}
        {['showMainMenu', 'initialize', 'gameOver'].includes(machine.value.toString()) ? <aside id="main-menu">
          <div className="wrapper">
            <h1>
              Oh no! You've encountered a goblin!
            </h1>
            <button
                id="start-btn"
                onClick={e => {
                    log('-> Transitioning from showMainMenu to determineNextActor...');
                    send({
                        type: 'PLAY_BTN_CLICK'
                    });
                }}
            >
              Fight!
            </button>
          </div>
        </aside> : undefined}
        <aside id="actions-panel">
          <h1 id="character-name">
              {player ?  player.name : 'Hero'}
          </h1>
          <img id="profile-image" src={player ? `images/profiles/${player.profileImage}` : undefined}/>
          <form>
            <label htmlFor="hp">Hit Points</label>
            <input id="hp" type="number" value={player ? player.currentHitPoints : 0} disabled />
            <label htmlFor="temp-hp">Temporary Hit Points</label>
            <input id="temp-hp" type="number" value={player ? player.temporaryHitPoints : 0} disabled />
          </form>
          <h2>Actions</h2>
          <ul>
            <li>
              <button
                id="attack"
                disabled={!machine.matches('playerTurn')}
                onClick={async () => {
                    if (!enemy) return;

                    const results = await attack(enemy);
                    machine.context.enemy = results.targetData;

                    log('-> Transitioning from playerTurn to checkWinCondition...');
                    send({
                        type: 'COMPLETE'
                    });
                }}
              >
                Greatsword Attack
              </button>
            </li>
            <li>
              <button
                id="cast-spell"
                disabled={!machine.matches('playerTurn')}
                onClick={async () => {
                    if (!enemy) return;

                    const results = await castSpell(enemy);
                    machine.context.enemy = results.targetData;
                    log('-> Transitioning from playerTurn to checkWinCondition...');
                    send({
                        type: 'COMPLETE'
                    });
                }}
              >
                Burning Hands
              </button>
            </li>
            <li>
              <button
                id="cast-heal"
                disabled={!machine.matches('playerTurn')}
                onClick={async () => {
                    if (!player) return;

                    const results = await heal(player);
                    machine.context.player = results.targetData;
                    log('-> Transitioning from playerTurn to checkWinCondition...');
                    send({
                        type: 'COMPLETE'
                    });
                }}
              >
                Cure Wounds
              </button>
            </li>
            <li>
              <button
                id="request-boon"
                disabled={!machine.matches('playerTurn')}
                onClick={async () => {
                    if (!player) return;

                    const results = await requestBoon(player);
                    machine.context.player = results.targetData;
                    log('-> Transitioning from playerTurn to checkWinCondition...');
                    send({
                        type: 'COMPLETE'
                    });
                }}
              >
                Pray to Helm
              </button>
            </li>
          </ul>
        </aside>
        <section id="display">
            <header>
                <h3>
                    {headerLabel}
                </h3>
            </header>
        </section>
    </>);
};

ReactDOM.render(<Application />, document.querySelector('main'));

// Extra initialization logic outside of component lifecycle.
(() => {
    const loader = document.querySelector('.lds-roller-wrapper');
        if (loader) {
        loader.addEventListener('transitionend', () => {
            loader.classList.add('complete');
        });
    }

    WebFont.load({
        google: {
            families: [
            'UnifrakturMaguntia',
            'Fondamento'
            ]
        }
    });

    // Inject 3D renderer into DOM.
    init();
    animate();
})();
