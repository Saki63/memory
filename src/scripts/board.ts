import {Settings} from './classes/settings.class'
import {Game} from './classes/game.class'
import type {Theme, Player} from './utils';
import {getSecondPlayer, getPlayerColor} from './utils';
import {
    getScoreOfPlayerTemplate, 
    getCurrentPlayerImgCodeVibesTemplate, 
    getCurrentPlayerImgFoodTemplate,
    getExitBtnImgCodeVibesTemplate,
    getExitBtnImgFoodTemplate,
    cardTemplate,
    getExitBtnHoverImgCodeVibesTemplate,
    getExitBtnHoverImgFoodTemplate
} from './templates';

window.addEventListener("load", initBoardPage);

function initBoardPage(){
    const settings = new Settings();
    settings.readStorage('all');
    const theme = settings.getTheme();
    themeView(theme);
    addExitBtnListener(theme);
    addBackBtnListener(theme);
    const player = settings.getPlayer();
    displayScore(player, theme);
    displayCurrentPlayer(player, theme);
    displayExitBtnIcon(theme);
    const boardSize = settings.getBoardSize();
    const game = new Game(Number(boardSize), player, theme);
    setBoard(theme, game.cards);
    addCardListener(game);
    displayScore(player, theme, true);
    buildGameOverOverlay(theme);
    buildWinnerOverlay(theme);
}

function themeView(theme: Theme){
    document.body.className = "theme_" + theme;
}

function addExitBtnListener(theme: Theme){
    const exitBtnRef = document.getElementById('exit-btn-id');
    if (exitBtnRef){
        exitBtnRef.addEventListener("mouseover", e => {
            changeExitIcon(theme, 'hover');
        })
    }
    if (exitBtnRef){
        exitBtnRef.addEventListener("mouseleave", e => {
            changeExitIcon(theme, 'default');
        })
    }
    if (exitBtnRef){
        exitBtnRef.addEventListener("click", e => {
            document.getElementById('exit-dialog-overlay')?.classList.toggle("d_none");
        })
    }
}

function addBackBtnListener(theme: Theme){
    const backToGameBtnRef = document.getElementById('back-to-game-btn');
    if (backToGameBtnRef){
        backToGameBtnRef.addEventListener("click", e => {
            document.getElementById('exit-dialog-overlay')?.classList.toggle("d_none");
        })
    }
}

function changeExitIcon(theme: Theme, event: 'hover' | 'default' = 'default'){
    const currentPlayerRef = document.getElementById('exit-btn-img-id');
    if (currentPlayerRef && event === 'hover') currentPlayerRef.innerHTML = getExitBtnHoverImg(theme);
    if (currentPlayerRef && event === 'default') currentPlayerRef.innerHTML = getExitBtnImg(theme);
}

function getExitBtnHoverImg(theme: Theme){
    let template = "";
    switch(theme){
        case 'code_vibes':
            template = getExitBtnHoverImgCodeVibesTemplate();
            break;
        case 'food':
            template = getExitBtnHoverImgFoodTemplate();
            break;
        default:
            console.error("This theme has no image!");
    }
    return template;
}

function displayScore(firstPlayer: Player, theme: Theme, finalScore = false){
    const finalId = finalScore ? 'final-' : '';
    const scoreRef = document.getElementById(finalId + 'score');
    const secondPlayer: Player = getSecondPlayer(firstPlayer);
    if (scoreRef){
        scoreRef.innerHTML = getScoreOfPlayerTemplate(firstPlayer, theme, finalId) + getScoreOfPlayerTemplate(secondPlayer, theme, finalId);
    }
    setScoreOfPlayer(firstPlayer, theme, 0, finalId);
    setScoreOfPlayer(secondPlayer, theme, 0, finalId);
}

export function setScoreOfPlayer(player: Player, theme: Theme, score: number, finalId: string){
    const playerScoreRef = document.getElementById(player + '-player-' + finalId + 'score-id');
    if (playerScoreRef){
        playerScoreRef.innerText = theme === 'code_vibes' ? `${player} ${score}` : `${score}`;
    }
}

export function displayCurrentPlayer(currentPlayer: Player, theme: Theme){
    const currentPlayerRef = document.getElementById('current-player-img-id');
    if (currentPlayerRef) currentPlayerRef.innerHTML = getCurrentPlayerImg(currentPlayer, theme);
}

function getCurrentPlayerImg(currentPlayer: Player, theme: Theme){
    const playerColorHex = getPlayerColor(currentPlayer);
    let template = "";

    switch(theme){
        case 'code_vibes':
            template = getCurrentPlayerImgCodeVibesTemplate(playerColorHex);
            break;
        case 'food':
            template = getCurrentPlayerImgFoodTemplate(playerColorHex);
            break;
        default:
            console.error("This theme has no image!");
            break;
    }
    return template;
}

function displayExitBtnIcon(theme: Theme){
    const currentPlayerRef = document.getElementById('exit-btn-img-id');
    if (currentPlayerRef) currentPlayerRef.innerHTML = getExitBtnImg(theme);
}

function getExitBtnImg(theme: Theme){
    let template = "";
    switch(theme){
        case 'code_vibes':
            template = getExitBtnImgCodeVibesTemplate();
            break;
        case 'food':
            template = getExitBtnImgFoodTemplate();
            break;
        default:
            console.error("This theme has no image!");
    }
    return template;
}

function setBoard(theme: Theme, cards: number[]){
    const boardRef = document.getElementById('board-id');
    if (boardRef) boardRef.innerHTML = buildBoard(theme, cards);
    boardRef?.classList.add('board_size_' + cards.length);
}

function buildBoard(theme: Theme, cards: number[]){
    let template = '';
    for(let index = 0; index < cards.length; index++){
        template += cardTemplate(index, theme, cards);
    }
    return template;
}

function addCardListener(game: Game){
    const boardRef = document.getElementById('board-id');
    if (boardRef){
        boardRef.addEventListener("click", e => {
            const card = (e.target as HTMLElement).closest(".card") as HTMLButtonElement;
            if (card && !card.classList.contains("is-flipped") && !game.waiting){
                card.classList.toggle("is-flipped");
                game.openCard(extractCardIdx(card.id));
            }
        })
    }
}

function extractCardIdx(htmlId: string){
    const parts = htmlId.split("-");
    return Number(parts[1]);
}

function buildGameOverOverlay(theme: Theme){
    const picRef = document.getElementById('game-over-lettering') as HTMLImageElement;
    picRef.src = "/assets/img/game-over-" + theme + ".png";
}

function buildWinnerOverlay(theme: Theme){
    const confettiRef = document.getElementById('confetti-img') as HTMLImageElement;
    confettiRef.src = theme === 'code_vibes' ? "/assets/img/confetti.png" : "";

    const homeBtnRef = document.getElementById('home-btn') as HTMLLinkElement;
    homeBtnRef.innerHTML = theme === 'code_vibes' ? "Back to start" : "Home";
}





export function setFinalScores(firstPlayer: Player, secondPlayer: Player, firstScore: number, secondScore: number){
    setFinalScore(firstPlayer, firstScore);
    setFinalScore(secondPlayer, secondScore);
}

function setFinalScore(player: Player, score: number){
    const scoreRef = document.getElementById(player + '-player-final-score-id');
    if (scoreRef) scoreRef.innerText = `${score}`;
}

export function announceDrawInOverlay(firstPlayer: Player, secondPlayer: Player){
    const startTextRef = document.getElementById('start-text');
    if (startTextRef) startTextRef.innerText = "It's a tie!";

    const winnerRef = document.getElementById('winner-announcement');
    if (winnerRef) winnerRef.classList.toggle("d_none");

    const firstImgRef = document.getElementById('winner-img') as HTMLImageElement;
    if (firstImgRef) firstImgRef.src = "/assets/img/winners/chess_pawn_" + firstPlayer +".png";

    const secondImgRef = document.getElementById('tie-img') as HTMLImageElement;
    if (secondImgRef) secondImgRef.src = "/assets/img/winners/chess_pawn_" + secondPlayer + ".png";
    secondImgRef.classList.toggle("d_none");
}

export function announceWinnerInOverlay(player: Player){
    const winnerRef = document.getElementById('winner-announcement');
    if (winnerRef) winnerRef.innerText = player + " Player";

    const winnerImgRef = document.getElementById('winner-img') as HTMLImageElement;
    if (winnerImgRef) winnerImgRef.src = "/assets/img/winners/chess_pawn_" + player + ".png";
}

export function toggleOverlay(overlayId: string){
    const overlayRef = document.getElementById(overlayId);
    if (overlayRef) overlayRef.classList.toggle("d_none");
}







