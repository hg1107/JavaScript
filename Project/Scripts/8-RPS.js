const score = JSON.parse(localStorage.getItem('score')) || {wins: 0, losses: 0, ties: 0};
let result;
function pickComputerMove(){
    let computerMove;
    const randomNumber = Math.random();
    if (randomNumber >=0 && randomNumber < 1/3){
        computerMove = 'Rock';
    }else if (randomNumber >= 1/3 && randomNumber < 2/3){
        computerMove = 'Paper';
    }else if (randomNumber >= 2/3 && randomNumber < 1){
        computerMove = 'Scissors';
    }
    return computerMove;
}

document.body.addEventListener('keydown', (event) => {
    if (event.key === 'r') {
        playGame('Rock');
    } else if (event.key === 'p') {
        playGame('Paper');
    } else if (event.key === 's') {
        playGame('Scissors');
    }
})


function playGame(playerMove){
    const computerMove = pickComputerMove();

    if (playerMove === 'Scissors'){
        if(computerMove === 'Rock'){
            result = 'You lose';
        }else if(computerMove === 'Paper'){
            result = 'You win';
        }else if(computerMove === 'Scissors'){
            result = 'Tie';
        }

    } else if (playerMove === 'Rock'){
        if(computerMove === 'Rock'){
            result = 'Tie';
        }else if(computerMove === 'Paper'){
            result = 'You lose';
        }else if(computerMove === 'Scissors'){
            result = 'You win';
        }

    } else if (playerMove === 'Paper'){
        if(computerMove === 'Rock'){
            result = 'You win';
        }else if(computerMove === 'Paper'){
            result = 'Tie';
        }else if(computerMove === 'Scissors'){
            result = 'You lose';
        }
    }

    if (result === 'You win'){
        score.wins += 1;
    }else if (result === 'You lose'){
        score.losses += 1;
    }else if (result === 'Tie'){
        score.ties += 1;
    }

    localStorage.setItem('score', JSON.stringify(score));

    document.querySelector('.js-move-result').innerHTML = `You chose <img src = "Images/${playerMove}-emoji.png" class="move-icon"> - Computer chose <img src = "Images/${computerMove}-emoji.png" class="move-icon">`;
    document.querySelector('.js-result').innerHTML = result;

    scoreElement = document.querySelector('.js-score');
    scoreElement.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;

}

function resetButton () {
    score.wins = 0;
    score.losses = 0;
    score.ties = 0;
    localStorage.removeItem('score');
    scoreElement.innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}


let isAutoPlaying = false;
let intervalID;
function autoPlay () {
    if (!isAutoPlaying){
        intervalID = setInterval(function() {
            const playerMove = pickComputerMove();
            playGame(playerMove);
        }, 1000);
        isAutoPlaying = true;
        document.querySelector('.js-auto-play-button').innerHTML = 'Stop Playing';
    } else {
        clearInterval(intervalID);
        isAutoPlaying = false;
        document.querySelector('.js-auto-play-button').innerHTML = 'Auto Play';
    }
}

