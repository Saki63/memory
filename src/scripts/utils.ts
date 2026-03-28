export type Theme = 'code_vibes' | 'food';
export type Player = 'blue' | 'orange';
export type BoardSize = '16' | '24' | '36';

export const THEMES = ['code_vibes', 'food'];
export const PLAYERS = ['blue', 'orange'];
export const BOARD_SIZES = ['16', '24', '36'];

const COLOR_BLUE_HEX = '#097FC5';
const COLOR_ORANGE_HEX = '#F58E39';

/**
 * Retruns the second player.
 * 
 * @param firstPlayer - Identifier of the first player
 * @returns Identifier of the second player depending on the first player
 */
export function getSecondPlayer(firstPlayer: Player){
    return firstPlayer === "blue" ? "orange" : "blue";
}

/**
 * Returns the color code of the player.
 * 
 * @param player - Identifier of the player
 * @returns Color code of the player
 */
export function getPlayerColor(player: Player){
    let color = '#0000';
    switch (player){
        case 'blue':
            color = COLOR_BLUE_HEX;
            break;
        case 'orange':
            color = COLOR_ORANGE_HEX;
            break;
        default:
            console.error("This player color is missing!");
    }
    return color;
}