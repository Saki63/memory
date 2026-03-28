import type {Theme, Player} from '../utils';
import { setScoreOfPlayer,
    setFinalScores,
    announceDrawInOverlay,
    announceWinnerInOverlay,
    toggleOverlay,
    displayCurrentPlayer,
    matchedCardDesign
 } from '../board';

 /**
 * Represents the core game logic including card handling,
 * player turns, scoring, and game state management.
 */
export class Game{
    score = {
        blue: 0,
        orange: 0
    };

    currentCards: number[] = [];
    closedCards: number[] = [];
    startPlayer: Player;

    theme: Theme;
    boardSize: number;
    currentPlayer: Player;
    deckOfCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
    cards: number[];
    waiting = false;
    end = false;

    /**
     * Creates a new Game instance, initializes players, theme, and board,
     * and generates a randomized set of card pairs.
     *
     * @param boardSize - The total number of cards on the board
     * @param startPlayer - The player who starts the game
     * @param theme - The selected theme
     */
    constructor(boardSize: number, startPlayer: Player, theme: Theme){
        this.boardSize = boardSize;
        this.startPlayer = startPlayer;
        this.currentPlayer = startPlayer;
        this.cards = [];
        this.theme = theme;
        console.log(boardSize);
        console.log(this.deckOfCards.length*2);
        if (boardSize <= this.deckOfCards.length*2)
        {
            this.getRandomCards();
        } else {
            console.error("Your board size is larger than the size of deck of cards");
        }
    }

    /**
     * Generates a randomized set of card pairs based on the board size.
     * Cards are duplicated and shuffled to create the game board.
     */
    getRandomCards(){
        const cardSize = this.boardSize/2;
        this.deckOfCards.sort(() => Math.random() - 0.5);
        for (let cardIdx = 0; cardIdx < cardSize; cardIdx++){
            this.cards.push(this.deckOfCards[cardIdx]);
            this.cards.push(this.deckOfCards[cardIdx]);                
        }
        this.cards.sort(() => Math.random() - 0.5);
    }

    /**
     * Handles the logic when a card is opened.
     * Checks for matches, updates scores, switches players,
     * and triggers end-of-game behavior if necessary.
     *
     * @param cardIdx - The index of the opened card
     */
    openCard(cardIdx: number){
        this.currentCards.push(cardIdx);
        if(this.currentCards.length % 2 === 0){            
            if(this.checkCardsForEquality()){     
                matchedCardDesign(this.currentCards[this.currentCards.length -1]);
                matchedCardDesign(this.currentCards[this.currentCards.length -2]);
                this.increaseScore();
                if(this.isEndOfGame()){
                    this.gameEnding();
                }
            } else {
                this.resetBoardForNextPlayer();
            }
        }
    }

    /**
     * Increases the score of the current player and adjust score view
     */
    increaseScore(){
        this.score[this.currentPlayer] += 1;
        setScoreOfPlayer(this.currentPlayer, this.theme, this.score[this.currentPlayer], '');        
    }

    /**
     * Set final score, adjust the overlays and displays them
     */
    gameEnding(){
        const secondPlayer = this.startPlayer === "blue" ? "orange" : "blue";
        setFinalScores(this.startPlayer, secondPlayer, this.score[this.startPlayer], this.score[secondPlayer]);
        this.prepareOverlay(secondPlayer);
        this.displayEndingScreens();
    }

    /**
     * Checks if it is a tie and adjust overlay
     * 
     * @param secondPlayer - Second player of the game
     */
    prepareOverlay(secondPlayer: Player){
        if (this.isTie()){
            announceDrawInOverlay(this.startPlayer, secondPlayer);
        } else {
            announceWinnerInOverlay(this.currentPlayer);
        }        
    }

    /**
     * Displays the overlays afterwards
     */
    displayEndingScreens(){
        toggleOverlay('game-over-overlay');
        setTimeout(() => {
            toggleOverlay('game-over-overlay');
            toggleOverlay('winner-overlay');
        }, 1500);        
    }

    /**
     * Truns around the cards and displays the next player
     */
    resetBoardForNextPlayer(){
        this.waiting = true;
        setTimeout(()=>{
            this.turnAroundCards();
            this.currentPlayer = this.currentPlayer === "blue" ? "orange" : "blue";
            displayCurrentPlayer(this.currentPlayer, this.theme);   
            this.waiting = false;                 
        }, 1000);
    }

    /**
     * Checks whether the game has ended by comparing the total score
     * with the number of card pairs.
     *
     * @returns True if the game is finished, otherwise false
     */
    isEndOfGame(){
        this.end = this.score.blue + this.score.orange === this.boardSize/2;
        return this.end;
    }

    /**
     * Checks whether the last two opened cards are equal.
     *
     * @returns True if the cards match, otherwise false
     */
    checkCardsForEquality(){
        return this.getCardId(this.currentCards[this.currentCards.length -1]) === this.getCardId(this.currentCards[this.currentCards.length -2]);
    }

    /**
     * Returns the card identifier for a given index.
     *
     * @param cardIdx - The index of the card
     * @returns The card ID
     */
    getCardId(cardIdx: number){
        return this.cards[cardIdx];
    }

    /**
     * Turns the last two opened cards back around (face down).
     */
    turnAroundCards(){
        this.turnAroundCard(this.currentCards.pop());
        this.turnAroundCard(this.currentCards.pop());
    }

    /**
     * Turns a specific card back around (face down) if defined.
     *
     * @param cardIdx - The index of the card to flip back
     */
    turnAroundCard(cardIdx: number | undefined){
        if (cardIdx !== undefined){
            const card = document.getElementById(`card-${cardIdx}-id`);
            card?.classList.toggle("is-flipped");            
        }
    }

    /**
     * Checks whether the game ended in a tie.
     *
     * @returns True if both players have equal scores, otherwise false
     */
    isTie(){
        return this.score.blue === this.score.orange;
    }
}