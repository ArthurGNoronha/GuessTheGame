let currentGameId;
let images = [];
const dropdown = document.querySelector('.dropdown');
const inputDrop = document.getElementById('game-guess');
const options = document.querySelectorAll('.liGame');

inputDrop.addEventListener('input', () => {
    dropdown.style.display = 'block';
    const value = inputDrop.value.toLowerCase();

    options.forEach((option) => {
        if (option.innerText.toLowerCase().includes(value)) {
            option.style.display = 'block';
        } else {
            option.style.display = 'none';
        }
    });
});

inputDrop.addEventListener('blur', () => {
    setTimeout(() => {
        dropdown.style.display = 'none';
    }, 200);
});

inputDrop.addEventListener('focus', () => {
    dropdown.style.display = 'block';
});

options.forEach((option) => {
    option.addEventListener('click', () => {
        inputDrop.value = option.innerText;
        dropdown.style.display = 'none';
    });
});

async function loadRandomGame() {
    try {
        const response = await fetch('/random-game');
        const data = await response.json();
        
        if (data.fim) {
            document.getElementById('game').style.display = 'none';
            document.getElementById('game-image').style.display = 'none';
            document.getElementById('guess').style.display = 'none';
            document.getElementById('game-guess').style.display = 'none';
            document.getElementById('chances').style.display = 'none';
            document.getElementById('nextGame').style.display = 'none';
            document.querySelector('.imgContainer').style.display = 'none';
            document.querySelector('.divBtns').style.display = 'none';
            document.querySelector('.highestUserScore').style.display = 'none';
            document.getElementById('fim').style.display = 'block';
            document.getElementById('score').style.display = 'block';
            document.getElementById('score').innerText = `Sua pontuação foi: ${data.score}`;
            return;
        }

        if (data.error) {

            console.error('Erro ao carregar jogo:', data.error);
            return;
        }

        document.getElementById('game-image').src = data.image;
        currentGameId = data.gameId;

        document.getElementById('game-attempt').value = 0;
        document.getElementById('chances').innerText = 'Tentativas restantes: 5';
        document.getElementById('chances').style.color = 'white';
        document.getElementById('chances').classList.remove('amassou');
        document.getElementById('chances').classList.remove('green');

        document.getElementById('game').innerHTML = '';
        document.getElementById('game-guess').value = '';

        document.getElementById('guess').style.display = 'block';
        document.getElementById('game-guess').style.display = 'block';
        document.getElementById('priorBtn').style.display = 'block';

        document.getElementById('nextGame').style.display = 'none';

        images = data.images;
        document.querySelectorAll('.btnImages').forEach((btn) => {
            btn.disabled = true;
            btn.classList.add('disabledBtns');
        });

    } catch (error) {
        console.error('Erro ao carregar o jogo:', error);
    }
}

document.getElementById('priorBtn').addEventListener('click', handleGuess);

document.getElementById('guess').addEventListener('click', handleGuess);

async function handleGuess() {
    const guess = document.getElementById('game-guess').value;
    let attempt = parseInt(document.getElementById('game-attempt').value);

    const response = await fetch(`/game/${currentGameId}/guess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guess, attempt })
    });

    document.getElementById('game-guess').value = '';

    const data = await response.json();
    images = data.images;
    document.getElementById('chances').innerText = 'Tentativas restantes: ' + (4 - attempt);

    if (data.error) {
        console.error('Erro ao verificar tentativa:', data.error);
        return;
    }

    if (data.limite) {
        document.getElementById('chances').innerText = 'Boa sorte na próxima :/';
        document.getElementById('chances').style.color = 'red';
        document.getElementById('game').innerHTML = `O jogo era: <span class="green">${data.gameName}</span>`;
        document.getElementById('guess').style.display = 'none';
        document.getElementById('game-guess').style.display = 'none';
        document.getElementById('priorBtn').style.display = 'none';
        document.getElementById('game-image').src = data.images[4];
        document.getElementById('nextGame').style.display = 'block';
        return;
    }

    if (data.correct) {
        document.getElementById('chances').innerText = `Parabéns! Você acertou em ${attempt + 1} tentativas!`;
        if(attempt === 0) {
            document.getElementById('chances').classList.add('amassou');
            document.getElementById('chances').innerText = 'UAU! Você acertou com UMA tentativa!';
        }
        if(attempt === 4) {
            document.getElementById('chances').innerText = 'UUUUUFF! Você acertou na ULTIMA tentativa!';
            document.getElementById('chances').style.color = 'lightgreen';
        }
        document.getElementById('guess').style.display = 'none';
        document.getElementById('game-guess').style.display = 'none';
        document.getElementById('game').innerHTML = `O jogo era: <span class="green">${data.gameName}</span>`;
        document.getElementById('priorBtn').style.display = 'none';
        images = data.images;
        enableBtns(4);
        document.getElementById('nextGame').style.display = 'block';
    } else {
        attempt++;
        document.getElementById('game-attempt').value = attempt;
        document.getElementById('game-image').src = data.image;
        enableBtns(attempt);
    }
}

function enableBtns(attempt) {
    for (let i = 1; i <= attempt + 1; i++) {
        document.getElementById(`img-${i}`).disabled = false;
        document.getElementById(`img-${i}`).classList.remove('disabledBtns');
    }
}

document.querySelectorAll('.btnImages').forEach((btn) => {
    btn.addEventListener('click', () => {
        const index = btn.id.split('-')[1];
        const image = images[index - 1];
        document.getElementById('game-image').src = image;
    });
});

document.getElementById('nextGame').addEventListener('click', () => {
    loadRandomGame();
    document.getElementById('nextGame').style.display = 'none';
});

window.onload = loadRandomGame;