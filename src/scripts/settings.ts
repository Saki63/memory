import { Settings } from './classes/settings.class';
import type {Theme, Player, BoardSize} from './utils';

let settings: Settings | undefined = undefined;

window.addEventListener("load", initSettingsPage);
window.addEventListener("beforeunload", clearAllCheckbox);

/**
 * Initializes the settings page by creating a new Settings instance
 * and registering all required event listeners.
 */
export function initSettingsPage(){
    settings = new Settings();
    addAllListeners();
}

/**
 * Registers all event listeners for the settings (theme, player, board size, start button).
 */
function addAllListeners(){
    addThemeSettingListener();
    addPlayerSettingListener();
    addBoardSizeSettingListener();
    addStartBtnListener();
}

/**
 * Adds click listeners for selecting the theme.
 * Currently supports "code_vibes" and "food".
 */
function addThemeSettingListener(){
    const themeCodeVibesLabel = document.getElementById('theme-code-vibes-label-id');
    const themeFoodLabel = document.getElementById('theme-food-label-id');
    if (themeCodeVibesLabel && themeFoodLabel) {
        themeCodeVibesLabel.addEventListener('click', () => changeTheme('code_vibes'));
        themeFoodLabel.addEventListener('click', () => changeTheme('food'));
        themeCodeVibesLabel.addEventListener('mouseover', () => setThemeCover('code_vibes'));
        themeFoodLabel.addEventListener('mouseover', () => setThemeCover('food'));
        themeCodeVibesLabel.addEventListener('mouseleave', () => resetThemeCover('code_vibes'));
        themeFoodLabel.addEventListener('mouseleave', () => resetThemeCover('food'));
    }
}

/**
 * Adds click listeners for selecting the player.
 * Currently supports "blue" and "orange".
 */ 
function addPlayerSettingListener(){
    const playerBlueLabel = document.getElementById('player-blue-label-id');
    const playerOrangeLabel = document.getElementById('player-orange-label-id');
    if (playerBlueLabel && playerOrangeLabel) {
        playerBlueLabel.addEventListener('click', () => changePlayer('blue'));
        playerOrangeLabel.addEventListener('click', () => changePlayer('orange'));
    }
}

/**
 * Adds click listeners for selecting the board size.
 * Supports sizes 16, 24, and 36.
 */
function addBoardSizeSettingListener(){
    const boardSize16Label = document.getElementById('board-size-16-label-id');
    const boardSize24Label = document.getElementById('board-size-24-label-id');
    const boardSize36Label = document.getElementById('board-size-36-label-id');
    if (boardSize16Label && boardSize24Label && boardSize36Label) {
        boardSize16Label.addEventListener('click', () => changeBoardSize(16 as unknown as BoardSize));
        boardSize24Label.addEventListener('click', () => changeBoardSize(24 as unknown as BoardSize));
        boardSize36Label.addEventListener('click', () => changeBoardSize(36 as unknown as BoardSize));
    }
}

/**
 * Adds a click listener to the start button
 * which triggers saving the current settings.
 */
function addStartBtnListener(){
    const startBtn = document.getElementById('start-btn-id');
    if (startBtn) {
        startBtn.addEventListener('click', saveSettings);
    }
}

/**
 * Clears all selected checkboxes based on the current settings state.
 */
function clearAllCheckbox(){
    if (settings){
        clearCheckbox('theme', settings.getTheme());
        clearCheckbox('player', settings.getPlayer());
        clearCheckbox('board-size', settings.getBoardSize());
    }
}

/**
 * Unchecks a specific checkbox based on the setting type and value.
 *
 * @param setting - The type of setting (theme, player, or board-size)
 * @param radio - The currently selected value to be unchecked
 */
function clearCheckbox(setting: 'theme' | 'player' | 'board-size', radio: string){
    const htmlId = setting + '-' + radio + "-id";
    const radioBtnRef = document.getElementById(htmlId) as HTMLInputElement;
    if (radioBtnRef){
        radioBtnRef.checked = false;
    }
}

/**
 * Updates the selected theme, refreshes the UI,
 * updates the preview, and disables the start button if necessary.
 *
 * @param theme - The theme to be applied
 */
function changeTheme(theme: Theme){
    settings?.setTheme(theme);
    setThemeCover(theme);
    setSettingOverview('theme-setting-id', 'theme');
    disableButton();
}

/**
 * Updates the selected theme, refreshes the UI,
 * updates the preview, and disables the start button if necessary.
 *
 * @param theme - The theme to be applied
 */
function resetThemeCover(defaultTheme: Theme){
    const theme = settings?.getTheme() ? settings?.getTheme() : defaultTheme;
    setThemeCover(theme);
}

/**
 * Updates the selected player and refreshes the UI.
 *
 * @param player - The player to be selected
 */
function changePlayer(player: Player){
    settings?.setPlayer(player);
    setSettingOverview('player-setting-id', 'player');
    disableButton();
}

/**
 * Updates the board size and refreshes the UI accordingly.
 *
 * @param boardSize - The new board size
 */
function changeBoardSize(boardSize: BoardSize){
    settings?.setBoardSize(boardSize);
    setSettingOverview('board-size-setting-id', 'board-size');
    disableButton();
}

/**
 * Saves the current settings to storage.
 * If all settings are configured, enables navigation to the game board page.
 */
function saveSettings(){
    settings?.writeStorage();
    if(settings?.isAllSet()){
        const linkRef = document.getElementById('start-btn-id') as HTMLAnchorElement;
        linkRef.href = "/memory/board.html";
    }
}

/**
 * Updates the theme preview image based on the selected theme.
 *
 * @param theme - The currently selected theme
 */
function setThemeCover(theme: Theme){
    const themeImgRef = document.getElementById('theme-cover') as HTMLImageElement;
    if (themeImgRef){
        themeImgRef.setAttribute('src', import.meta.env.BASE_URL + "/assets/img/theme_cover/"+ theme + ".png");
    }
}

/**
 * Updates the UI display for a selected setting.
 *
 * @param htmlId - The ID of the HTML element to update
 * @param setting - The type of setting (theme, player, or board-size)
 */
function setSettingOverview(htmlId: string, setting: 'theme' | 'player' | 'board-size'){
    const settingRef = document.getElementById(htmlId);
    
    if (settingRef){
        const text = getSettingText(setting);
        settingRef.innerText = text ? text : "";
    }
}

/**
 * Returns the text for a selected setting.
 *
 * @param setting - The type of setting (theme, player, or board-size)
 */
function getSettingText(setting: 'theme' | 'player' | 'board-size'){
    let textRef: HTMLSpanElement | null = null;
    switch(setting){
        case 'theme':
            textRef = document.getElementById(`${setting}-${settings?.getTheme()}-text-id`) as HTMLSpanElement;
            break;
        case 'player':
            textRef = document.getElementById(`${setting}-${settings?.getPlayer()}-text-id`) as HTMLSpanElement;
            break;
        case 'board-size':
            textRef = document.getElementById(`${setting}-${settings?.getBoardSize()}-text-id`) as HTMLSpanElement;
            break;
        default:
            console.error('Setting not available!');
    }
    return textRef?.innerHTML;
}

/**
 * Enables the start button when all settings are set
 * and updates its visual state.
 */
function disableButton(){
    if(settings?.isAllSet()){
        document.getElementById('start-btn-id')?.classList.remove('start_btn--disabled');
        const slash1Ref = document.getElementById('slash1-id') as HTMLImageElement;
        const slash2Ref = document.getElementById('slash2-id') as HTMLImageElement;
        slash1Ref.src = `${import.meta.env.BASE_URL}/assets/img/line-3-obliquely.png`;
        slash2Ref.src = `${import.meta.env.BASE_URL}/assets/img/line-3-obliquely.png`;
    }
}