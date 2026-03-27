export type Theme = 'code_vibes' | 'food';
export type Player = 'blue' | 'orange';
export type BoardSize = '16' | '24' | '36';

export const themeTypes = ['code_vibes', 'food'];
export const playerTypes = ['blue', 'orange'];
export const boardSizeTypes = ['16', '24', '36'];

const colorBlueHex = '#097FC5';
const colorOrangeHex = '#F58E39';

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
            color = colorBlueHex;
            break;
        case 'orange':
            color = colorOrangeHex;
            break;
        default:
            console.error("This player color is missing!");
    }
    return color;
}