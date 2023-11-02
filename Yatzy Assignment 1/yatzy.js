document.addEventListener('DOMContentLoaded', () => {

    // Define dice Image and locate the dice png
    const diceImages = [
        "./dice/dice-six-faces-one.png",
        "./dice/dice-six-faces-two.png",
        "./dice/dice-six-faces-three.png",
        "./dice/dice-six-faces-four.png",
        "./dice/dice-six-faces-five.png",
        "./dice/dice-six-faces-six.png"
    ];
    

    // Make the score for each catogory equel 0 at the beginning of the game
    const lockedScores = { "Number 1": 0, "Number 2": 0, "Number 3": 0, "Number 4": 0, "Number 5": 0, "Number 6": 0, "Three of a kind": 0, "Four of a kind": 0, "Full House": 0, "Small straight": 0, "Large straight": 0, "Yatzee": 0, "Chance": 0, "Total Score": 0 };

    //Creating variable to store references elements
    const diceElements = Array.from(document.querySelectorAll('.dice'));
    const rollButton = document.querySelector('.center-button');
    const scoreboard = document.querySelector('table');
    const scoreButton = document.querySelector('.score');
    const rerollButton = document.querySelector('.re-roll-button');
    const endGameButton = document.querySelector('.end-game-button');
   
    //Initalize variable to keep track of the game
    let diceValues = Array(5).fill(1);
    let currentRound = 1;
    let currentTurn = 1;
    let selectedDice = Array(5).fill(false);
    let scoreCard = {};
    let gameEnded = false;

    //Make a roll dice function that check the player turn and round, but I couldn't find a solution to make the round and turn system work.
    const rollDice = () => {
        if (currentRound <= 13 && currentTurn <= 3) {
            for (let i = 0; i < diceElements.length; i++) {
                if (!selectedDice[i]) {
                    const randomValue = Math.floor(Math.random() * 6);
                    diceValues[i] = randomValue + 1;
                    diceElements[i].src = diceImages[randomValue];
                }
            }

            scoreCard = calculateScore(diceValues);
            updateScoreboard(scoreCard);
            currentTurn++;

            if (currentTurn > 3) {
                currentRound++;
                currentTurn = 1;
            }

            if (currentRound === 13) displayTotalScore();
            if (currentTurn > 3) rollButton.disabled = true;
        }
    };
    //Make a dice selection function that allow player to select dice they want to keep during the roll
    const toggleDiceSelection = (index) => {
        if (currentTurn <= 3) {
            selectedDice[index] = !selectedDice[index];
            const diceElement = diceElements[index];
            selectedDice[index] ? diceElement.classList.add('selected') : diceElement.classList.remove('selected');
        }
    };


    diceElements.forEach((diceElement, index) => diceElement.addEventListener('click', () => currentTurn <= 3 && toggleDiceSelection(index)));

    //Calculate score from 1 to 6 and call the other calculation function
    const calculateScore = (diceValues) => {
        const scoreCard = {};

        for (let number = 1; number <= 6; number++) {
            scoreCard[`Number ${number}`] = diceValues.filter(value => value === number).reduce((acc, val) => acc + val, 0);
        }

        scoreCard["Three of a kind"] = calculateThreeOfAKind(diceValues);
        scoreCard["Four of a kind"] = calculateFourOfAKind(diceValues);
        scoreCard["Full House"] = calculateFullHouse(diceValues);
        scoreCard["Small straight"] = calculateSmallStraight(diceValues);
        scoreCard["Large straight"] = calculateLargeStraight(diceValues);
        scoreCard["Yatzee"] = calculateYatzee(diceValues);
        scoreCard["Chance"] = calculateChance(diceValues);

        return scoreCard;
    };
    
    
    const calculateThreeOfAKind = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i <= 3; i++) if (sortedDiceValues[i] === sortedDiceValues[i + 2]) return sortedDiceValues.reduce((acc, val) => acc + val, 0);
        return 0;
    };

    const calculateFourOfAKind = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i <= 2; i++) if (sortedDiceValues[i] === sortedDiceValues[i + 3]) return sortedDiceValues.reduce((acc, val) => acc + val, 0);
        return 0;
    };

    const calculateFullHouse = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i <= 2; i++)
            if (sortedDiceValues[i] === sortedDiceValues[i + 2] && sortedDiceValues[i + 3] === sortedDiceValues[i + 4]) return 25;
        return 0;
    };

    const calculateSmallStraight = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i < sortedDiceValues.length - 3; i++) {
            if (
                sortedDiceValues[i] === sortedDiceValues[i + 1] - 1 &&
                sortedDiceValues[i + 1] === sortedDiceValues[i + 2] - 1 &&
                sortedDiceValues[i + 2] === sortedDiceValues[i + 3] - 1
            ) return 30;
        }
        return 0;
    };

    const calculateLargeStraight = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i < sortedDiceValues.length - 3; i++) {
            if (
                sortedDiceValues[i] === sortedDiceValues[i + 1] - 1 &&
                sortedDiceValues[i + 1] === sortedDiceValues[i + 2] - 1 &&
                sortedDiceValues[i + 2] === sortedDiceValues[i + 3] - 1 &&
                sortedDiceValues[i + 3] === sortedDiceValues[i + 4] - 1
            ) return 40;
        }
        return 0;
    };

    const calculateYatzee = (diceValues) => {
        const sortedDiceValues = diceValues.slice().sort((a, b) => a - b);
        for (let i = 0; i < sortedDiceValues.length - 1; i++) {
            if (sortedDiceValues[i] !== sortedDiceValues[i + 1]) {
                return 0;
            }
        }
        return 50;
    };
    

    const calculateChance = (diceValues) => diceValues.reduce((acc, val) => acc + val, 0);

    const calculateTotalScore = () => {
        let totalScore = 0;
        for (const category in lockedScores) if (lockedScores[category]) totalScore += scoreCard[category];
        document.querySelector('td.score[data-category="Total Score"]').textContent = totalScore;
    };

    const displayTotalScore = () => document.querySelector('td.score[data-category="Total Score"]').textContent = calculateTotalScore();

    //Update the score board when the player click on an unselected score.
    const updateScoreboard = (scoreCard) => {
        for (const category in scoreCard) {
            if (!lockedScores[category]) {
                const score = scoreCard[category];
                document.querySelector(`td.score[data-category="${category}"]`).textContent = score;
            }
        }

        const totalScore = Object.values(scoreCard).reduce((total, score) => total + score, 0);
        document.querySelector('td.score[data-category="Total Score"]').textContent = totalScore;
    };

    //A reset function that reset the game when the player click on the reset button
    const resetGame = () => {
        selectedDice = Array(5).fill(false);
        currentTurn = 1;
        diceValues = Array(5).fill(1);
        currentRound = 1;

        diceElements.forEach((element) => (element.src = diceImages[0]));

        //Restore the score to 0 like at the beginning of the game
        for (const category in lockedScores) {
            lockedScores[category] = 0;
            document.querySelector(`td.score[data-category="${category}"]`).textContent = '';
        }

        document.querySelector('td.score[data-category="Total Score"]').textContent = '';
    };

    //A end game function that allow player to end the game
    const endGame = () => {
        gameEnded = true;

        // Disable the roll and score buttons
        rollButton.disabled = true;
        scoreButton.disabled = true;
        rerollButton.disabled = true;

        // Display the final score or any end game message
        displayEndGameMessage();
    };

    //A event listener that allow player to click on the score that they want to keep
    scoreboard.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'TD' && target.classList.contains('score')) {
            const category = target.getAttribute('data-category');
            lockedScores[category] = 1;
            calculateTotalScore();
        }
    });

    //Add a alert display when the player click end game
    const displayEndGameMessage = () => {
        const finalScore = calculateTotalScore();
      
        alert(`Game Over! Your final score: ${finalScore}`);
    };


    //This are an event listener for the 3 button
    rerollButton.addEventListener('click', resetGame);
    rollButton.addEventListener('click', rollDice);
    endGameButton.addEventListener('click', endGame);
});
