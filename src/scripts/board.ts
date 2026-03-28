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

/**
 * Initializes the board page by loading settings, applying the theme,
 * setting up UI elements, initializing the game instance,
 * and registering all required event listeners.
 */
function initBoardPage(){
    const settings = new Settings();
    settings.readStorage('all');

    const theme = settings.getTheme();
    const player = settings.getPlayer();
    const boardSize = settings.getBoardSize();

    const game = new Game(Number(boardSize), player, theme);
    adjustGameView(theme, player, game)
}

/**
 * Views the board depending on the settings (theme, player, game)
 * 
 * @param theme - The Theme of the game
 * @param player - Player of the game
 * @param game - Game information and logic
 */
function adjustGameView(theme: Theme, player: Player, game: Game){
    themeView(theme);
    displayScore(player, theme);
    displayCurrentPlayer(player, theme);
    displayExitBtnIcon(theme);
    setBoard(theme, game.cards);
    buildOverlays(theme, player);
    addListeners(theme, game);    
}

/**
 * Add the event listeners
 * 
 * @param theme - The theme of the game
 * @param game - Infomation to the game
 */
function addListeners(theme: Theme, game: Game){
    addExitBtnListener(theme);
    addBackBtnListener(theme);
    addCardListener(game);
}

/**
 * Builds the overlay for the game
 * 
 * @param theme - The theme of the game
 * @param player - Information about the player
 */
function buildOverlays(theme: Theme, player: Player){
    displayScore(player, theme, true);
    buildGameOverOverlay(theme);
    buildWinnerOverlay(theme);
}

/**
 * Applies the selected theme to the document body.
 *
 * @param theme - The theme to be applied
 */
function themeView(theme: Theme){
    document.body.className = "theme_" + theme;
}

/**
 * Adds event listeners to the exit button for hover effects and click behavior.
 *
 * @param theme - The current theme used for styling the button
 */
function addExitBtnListener(theme: Theme){
    const exitBtnRef = document.getElementById('exit-btn-id');
    if (exitBtnRef){
        exitBtnRef.addEventListener("mouseover", e => {
            changeExitIcon(theme, 'hover');
        })
        exitBtnRef.addEventListener("mouseleave", e => {
            changeExitIcon(theme, 'default');
        })
        exitBtnRef.addEventListener("click", e => {
            document.getElementById('exit-dialog-overlay')?.classList.toggle("d_none");
        })
    }
}

/**
 * Adds a click listener to the "back to game" button to close the exit dialog.
 *
 * @param theme - The current theme (not directly used but kept for consistency)
 */
function addBackBtnListener(theme: Theme){
    const backToGameBtnRef = document.getElementById('back-to-game-btn');
    if (backToGameBtnRef){
        backToGameBtnRef.addEventListener("click", e => {
            document.getElementById('exit-dialog-overlay')?.classList.toggle("d_none");
        })
    }
}

/**
 * Changes the exit button icon depending on the interaction state.
 *
 * @param theme - The current theme
 * @param event - The interaction type ("hover" or "default")
 */
function changeExitIcon(theme: Theme, event: 'hover' | 'default' = 'default'){
    const currentPlayerRef = document.getElementById('exit-btn-img-id');
    if (currentPlayerRef && event === 'hover') currentPlayerRef.innerHTML = getExitBtnHoverImg(theme);
    if (currentPlayerRef && event === 'default') currentPlayerRef.innerHTML = getExitBtnImg(theme);
}

/**
 * Returns the HTML template for the exit button hover state.
 *
 * @param theme - The current theme
 * @returns The HTML string for the hover icon
 */
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

/**
 * Displays the score UI for both players and initializes their scores.
 *
 * @param firstPlayer - The starting player
 * @param theme - The current theme
 * @param finalScore - Whether to render the final score view
 */
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

/**
 * Updates the score display for a specific player.
 *
 * @param player - The player whose score is updated
 * @param theme - The current theme
 * @param score - The score value to display
 * @param finalId - Prefix used for final score elements
 */
export function setScoreOfPlayer(player: Player, theme: Theme, score: number, finalId: string){
    const playerScoreRef = document.getElementById(player + '-player-' + finalId + 'score-id');
    if (playerScoreRef){
        playerScoreRef.innerText = theme === 'code_vibes' ? `${player} ${score}` : `${score}`;
    }
}

/**
 * Displays the current player's indicator in the UI.
 *
 * @param currentPlayer - The active player
 * @param theme - The current theme
 */
export function displayCurrentPlayer(currentPlayer: Player, theme: Theme){
    const currentPlayerRef = document.getElementById('current-player-img-id');
    if (currentPlayerRef) currentPlayerRef.innerHTML = getCurrentPlayerImg(currentPlayer, theme);
}

/**
 * Returns the HTML template for the current player's indicator.
 *
 * @param currentPlayer - The active player
 * @param theme - The current theme
 * @returns The HTML string representing the current player
 */
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

/**
 * Displays the default exit button icon based on the theme.
 *
 * @param theme - The current theme
 */
function displayExitBtnIcon(theme: Theme){
    const currentPlayerRef = document.getElementById('exit-btn-img-id');
    if (currentPlayerRef) currentPlayerRef.innerHTML = getExitBtnImg(theme);
}

/**
 * Returns the HTML template for the default exit button icon.
 *
 * @param theme - The current theme
 * @returns The HTML string for the exit button icon
 */
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

/**
 * Renders the game board and applies the appropriate board size class.
 *
 * @param theme - The current theme
 * @param cards - Array representing the card layout
 */
function setBoard(theme: Theme, cards: number[]){
    const boardRef = document.getElementById('board-id');
    if (boardRef) boardRef.innerHTML = buildBoard(theme, cards);
    boardRef?.classList.add('board_size_' + cards.length);
}

/**
 * Builds the HTML template for the game board.
 *
 * @param theme - The current theme
 * @param cards - Array representing the card layout
 * @returns The HTML string for the board
 */
function buildBoard(theme: Theme, cards: number[]){
    let template = '';
    for(let index = 0; index < cards.length; index++){
        template += cardTemplate(index, theme, cards);
    }
    return template;
}

/**
 * Adds a click listener to the board for handling card interactions.
 *
 * @param game - The current game instance
 */
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

/**
 * Extracts the card index from a given HTML element ID.
 *
 * @param htmlId - The ID of the card element
 * @returns The extracted card index
 */
function extractCardIdx(htmlId: string){
    const parts = htmlId.split("-");
    return Number(parts[1]);
}

/**
 * Sets up the game-over overlay with the correct theme image.
 *
 * @param theme - The current theme
 */
function buildGameOverOverlay(theme: Theme){
    const picRef = document.getElementById('game-over-lettering') as HTMLImageElement;
    picRef.src = "/assets/img/game-over-" + theme + ".png";
}

/**
 * Configures the winner overlay visuals based on the selected theme.
 *
 * @param theme - The current theme
 */
function buildWinnerOverlay(theme: Theme){
    const confettiRef = document.getElementById('confetti-img') as HTMLImageElement;
    confettiRef.src = theme === 'code_vibes' ? "/assets/img/confetti.png" : "";

    const homeBtnRef = document.getElementById('home-btn') as HTMLLinkElement;
    homeBtnRef.innerHTML = theme === 'code_vibes' ? "Back to start" : "Home";
}

/**
 * Sets the final scores for both players in the overlay.
 *
 * @param firstPlayer - The first player
 * @param secondPlayer - The second player
 * @param firstScore - Score of the first player
 * @param secondScore - Score of the second player
 */
export function setFinalScores(firstPlayer: Player, secondPlayer: Player, firstScore: number, secondScore: number){
    setFinalScore(firstPlayer, firstScore);
    setFinalScore(secondPlayer, secondScore);
}

/**
 * Updates the final score display for a specific player.
 *
 * @param player - The player
 * @param score - The player's final score
 */
function setFinalScore(player: Player, score: number){
    const scoreRef = document.getElementById(player + '-player-final-score-id');
    if (scoreRef) scoreRef.innerText = `${score}`;
}

/**
 * Displays a draw result in the overlay, including both players' visuals.
 *
 * @param firstPlayer - The first player
 * @param secondPlayer - The second player
 */
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

/**
 * Displays the winner in the overlay.
 *
 * @param player - The winning player
 */
export function announceWinnerInOverlay(player: Player){
    const winnerRef = document.getElementById('winner-announcement');
    if (winnerRef) winnerRef.innerText = player + " Player";

    const winnerImgRef = document.getElementById('winner-img') as HTMLImageElement;
    if (winnerImgRef) winnerImgRef.src = "/assets/img/winners/chess_pawn_" + player + ".png";
}

/**
 * Toggles the visibility of a given overlay element.
 *
 * @param overlayId - The ID of the overlay element
 */
export function toggleOverlay(overlayId: string){
    const overlayRef = document.getElementById(overlayId);
    if (overlayRef) overlayRef.classList.toggle("d_none");
}







