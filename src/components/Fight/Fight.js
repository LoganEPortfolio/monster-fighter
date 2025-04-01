import { useState } from 'react';
import Fighter from './Fighter';
import './Fight.css';



// const enemies = ['Blockman', 'Butterfly', 'Bugz', 'Flowerz', 'Multihead', 'Squidman']

const fighterImages = {
    Blockman: process.env.PUBLIC_URL + '/images/blockMan.png',
    Bugz: process.env.PUBLIC_URL + '/images/bugz.png',
    Flowerz: process.env.PUBLIC_URL + '/images/flower.png',
    Butterfly: process.env.PUBLIC_URL + '/images/butterfly.png',
    Multihead: process.env.PUBLIC_URL + '/images/multihead.png',
    Squidman: process.env.PUBLIC_URL + '/images/squidMan.png',
}

const enemies = Object.keys(fighterImages)

const cloneFighter = (fighter) => {
    const newFighter = new Fighter(fighter.name, fighter.photo, fighter.type);
    newFighter.HP = fighter.HP;
    newFighter._healUses = fighter._healUses;

    if (fighter.isKnockedOut) {
        newFighter.toggleKnockOut();
    }
    return newFighter;
}


const Fight = (props) => {
    const [character, setCharacter] = useState({name: 'YOUR CHOICE!', photo: null, HP:100});
    const [target, setTarget] = useState({name: 'THE TARGET!', photo: null, HP: 100});
    const [isEnemyShaking, setIsEnemyShaking] = useState(false);
    const [isPlayerShaking, setIsPlayerShaking] = useState(false);
    const [battleLog, setBattleLog] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [enemyHPFlashClass, setEnemyHPFlashClass] = useState('');
    const [playerHPFlashClass, setPlayerHPFlashClass] = useState('');

    const getRandomItem = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    }

    const addBattleLog = (message) => {
        setBattleLog((prevLog) => [...prevLog, message]);
    }

    const handleSelect = (e) => {
        e.preventDefault();
        // Get the selected fighter from the select input
        const fighterValue = e.target.elements.fighterSelect.value;

        // Get the corresponding image for the selected fighter
        const fighterImage = fighterImages[fighterValue];
        // Create a new Fighter instance for the player
        const newCharacter = new Fighter(fighterValue, fighterImage);
        setCharacter(newCharacter);

        // Set the target to a random enemy from the enemies array
        const randomEnemy = getRandomItem(enemies);
        const enemyImage = fighterImages[randomEnemy];
        const newEnemy = new Fighter(randomEnemy, enemyImage);
        setTarget(newEnemy);

        setGameOver(false);
        setBattleLog([]);
    }

    const handleAttack = () => { 
        if (gameOver) return;

        // Playter attacks enemy
        const playerAttackResult = character.attack(target);
        addBattleLog(playerAttackResult.message);

        // Trigger shaking animation
        setIsEnemyShaking(true);
        setTimeout(() => setIsEnemyShaking(false), 500);

        // Trigger HP flash red for enemy HP text
        setEnemyHPFlashClass('flash-red');
        setTimeout(() => setEnemyHPFlashClass(''), 500);

        // Force re-render of enemy with updated HP.
        setTarget(cloneFighter(target));

        if (playerAttackResult.knockedOut) {
            const knockoutMessage = `${target.name} is knocked out! You win!`;
            addBattleLog(knockoutMessage);
            setGameOver(true);
            return;
        }

        setTimeout(() => {
            const enemyAttackResult = target.attack(character);
            addBattleLog(enemyAttackResult.message);

            // Trigger shake animation on player.
            setIsPlayerShaking(true);
            setTimeout(() => setIsPlayerShaking(false), 500);

            // Trigger HP flash red for player HP text
            setPlayerHPFlashClass('flash-red');
            setTimeout(() => setPlayerHPFlashClass(''), 500);

            setCharacter(cloneFighter(character));
            if (enemyAttackResult.knockedOut) {
                const knockoutMessage = `${character.name} is knocked out! You lose!`;
                addBattleLog(knockoutMessage);
                setGameOver(true);
            }
        }, 1000)

    }

    const handleHeal = () => {
        if (gameOver) return;

        const healMessage = character.heal();
        addBattleLog(healMessage)

        // Trigger HP flash green for player HP text when healed
        setPlayerHPFlashClass('flash-green');
        setTimeout(() => setPlayerHPFlashClass(''), 500);

        setCharacter(cloneFighter(character));
    }

    return (
        <div>
            <div className="fight-container">
        <div className="player-select">
            <form onSubmit={handleSelect} >
                <select name="fighterSelect">
                    <option value="Blockman">Blockman</option>
                    <option value="Bugz">Bugz</option>
                    <option value="Flowerz">Flowerz</option>
                    <option value="Butterfly">Butterfly</option>
                    <option value="Multihead">Multihead</option>
                    <option value="Squidman">Squidman</option>
                </select>
                <button type="submit"  name="button" className="btn btn-primary">Select
                    Fighter</button>
            </form>

        </div>
       
    </div>
    <div className="fight-box">
        
        <div className="mainContent playerContent">
            <div className="namePhoto">
                <div>
                    <h1 id={character.name}>{character.name}</h1> 
                    <h3>Potions Left: {character.healUses}</h3>
                </div>
                {character.photo && (
                     <img
                        src={character.photo}
                        width="200px"
                        alt={character.name}
                        className={isPlayerShaking ? 'shake' : ''}
                    />
                )}
            </div>
            <p className={playerHPFlashClass}>{character.HP}</p>
        </div>
        
        <h2>VS.</h2>
        
        <div className="mainContent enemyContent">
            <div className="namePhoto">
                <h1>{target.name}</h1> 
                {target.photo && (
                    <img
                        src={target.photo}
                        width="200px"
                        alt={target.name}
                        className={isEnemyShaking ? 'shake' : ''}
                />
                )}
            </div>
            <p className={enemyHPFlashClass}>{target.HP}</p>
        </div>

        <div className="actionButtons">
            <button onClick={handleAttack} className="btn btn-primary" disabled={gameOver}>
                Attack
            </button>
            {/* <form action="/enemyAttack" method="post">
                <button className="btn btn-primary btn-danger" id="enemyAttack">
                    Enemy Attack
                </button>
            </form> */}
            <button className="btn btn-primary btn-success" id="enemyAttack" onClick={handleHeal} disabled={gameOver || character.healUses === 0}>
                Health Potion
            </button>
        </div>
        <div className="battle-log">
            <h3>Battle Log</h3>
                <ul>
                    {battleLog.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
    </div>
</div>
    )
}

export default Fight;