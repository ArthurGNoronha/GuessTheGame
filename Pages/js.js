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
    const response = await fetch('/random-game');
    const data = await response.json();

    if (data.error) {
        console.error('Erro ao carregar jogo:', data.error);
        return;
    }

    document.getElementById('game-image').src = data.image;
    currentGameId = data.gameId;
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
        return;
    }

    if (data.correct) {
        document.getElementById('chances').innerText = `Parabéns! Você acertou em ${attempt + 1} tentativas!`;
        if(attempt === 0) {
            document.getElementById('chances').classList.add('amassou');
            document.getElementById('chances').innerText = 'UAU! Você acertou com UMA tentativa!';
        }
        document.getElementById('guess').style.display = 'none';
        document.getElementById('game-guess').style.display = 'none';
        document.getElementById('game').innerHTML = `O jogo era: <span class="green">${data.gameName}</span>`;
        document.getElementById('priorBtn').style.display = 'none';
        images = data.images;
        enableBtns(4);
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

window.onload = loadRandomGame;