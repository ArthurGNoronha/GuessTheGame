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
    }, 100);
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

document.getElementById('guess').addEventListener('click', async () => {
    const guess = document.getElementById('game-guess').value;
    const attempt = document.getElementById('game-attempt').value;

    const response = await fetch(`/game/${currentGameId}/guess`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guess, attempt })
    });

    const data = await response.json();
    console.log(data);
    images = data.images;
    console.log(data.images);
    document.getElementById('chances').innerText = 'Tentativas restantes: ' + (4 - attempt);

    if (data.error) {
        console.error('Erro ao verificar tentativa:', data.error);
        return;
    }

    if(data.limite) {
        document.getElementById('chances').innerText = 'Boa sorte na próxima :/';
        document.getElementById('chances').style.color = 'red';
        document.getElementById('game').innerHTML = `O jogo era: ${data.gameName}`;
        document.getElementById('guess').style.display = 'none';
        document.getElementById('game-guess').style.display = 'none';
        document.getElementById('game-image').src = data.gameImage[0];
        console.log(data);
    }

    if (data.correct) {
        document.getElementById('chances').innerText = `Parabens! Você acertou em ${ parseInt(attempt) + 1} tentativas!`;
        document.getElementById('guess').style.display = 'none';
        document.getElementById('game-guess').style.display = 'none';
        document.getElementById('game').innerHTML = `O jogo era: ${data.gameName}`;
    } else {
        document.getElementById('game-attempt').value = parseInt(attempt) + 1;
        document.getElementById('game-image').src = data.image;
        enableBtns(parseInt(attempt));
    }
});

function enableBtns(attempt) {
    for (let i = 1; i <= attempt + 1; i++) {
        document.getElementById(`img-${i}`).disabled = false;
        console.log(document.getElementById(`img-${i}`));
        document.getElementById(`img-${i}`).classList.remove('disabledBtns');
    }
}

document.querySelectorAll('.btnImages').forEach((btn) => {
    btn.addEventListener('click', () => {
        const index = btn.id.split('-')[0];
        const image = images[index];
        document.getElementById('game-image').src = image;
    });
});

window.onload = loadRandomGame;