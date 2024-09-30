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

window.onload = loadRandomGame;