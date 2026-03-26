import { Settings } from './classes/settings.class';
import type {Theme, Player, BoardSize} from './utils';

let settings: Settings | undefined = undefined;

window.addEventListener("load", initSettingsPage);
window.addEventListener("beforeunload", clearAllCheckbox);

export function initSettingsPage(){
    settings = new Settings();
    addAllListeners();
}

function addAllListeners(){
    addThemeSettingListener();
    addPlayerSettingListener();
    addBoardSizeSettingListener();
    addStartBtnListener();
}

function addThemeSettingListener(){
    const themeCodeVibesLabel = document.getElementById('theme-code-vibes-label-id');
    const themeFoodLabel = document.getElementById('theme-food-label-id');
    if (themeCodeVibesLabel && themeFoodLabel) {
        themeCodeVibesLabel.addEventListener('click', () => changeTheme('code_vibes'));
        themeFoodLabel.addEventListener('click', () => changeTheme('food'));
    }
}

function addPlayerSettingListener(){
    const playerBlueLabel = document.getElementById('player-blue-label-id');
    const playerOrangeLabel = document.getElementById('player-orange-label-id');
    if (playerBlueLabel && playerOrangeLabel) {
        playerBlueLabel.addEventListener('click', () => changePlayer('blue'));
        playerOrangeLabel.addEventListener('click', () => changePlayer('orange'));
    }
}

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

function addStartBtnListener(){
    const startBtn = document.getElementById('start-btn-id');
    if (startBtn) {
        startBtn.addEventListener('click', saveSettings);
    }
}

function clearAllCheckbox(){
    if (settings){
        clearCheckbox('theme', settings.getTheme());
        clearCheckbox('player', settings.getPlayer());
        clearCheckbox('board-size', settings.getBoardSize());
    }
}

function clearCheckbox(setting: 'theme' | 'player' | 'board-size', radio: string){
    const htmlId = setting + '-' + radio + "-id";
    const radioBtnRef = document.getElementById(htmlId) as HTMLInputElement;
    if (radioBtnRef){
        radioBtnRef.checked = false;
    }
}

function changeTheme(theme: Theme){
    settings?.setTheme(theme);
    setThemeCover(theme);
    setSettingOverview('theme-setting-id', 'theme');
    disableButton();
}

function changePlayer(player: Player){
    settings?.setPlayer(player);
    setSettingOverview('player-setting-id', 'player');
    disableButton();
}

function changeBoardSize(boardSize: BoardSize){
    settings?.setBoardSize(boardSize);
    setSettingOverview('board-size-setting-id', 'board-size');
    disableButton();
}

function saveSettings(){
    settings?.writeStorage();
    if(settings?.isAllSet()){
        const linkRef = document.getElementById('start-btn-id') as HTMLAnchorElement;
        linkRef.href = "board.html";
    }
}

function setThemeCover(theme: Theme){
    const themeImgRef = document.getElementById('theme-cover');
    if (themeImgRef){
        themeImgRef.setAttribute('src', "/assets/img/theme_cover/"+ theme + ".png");
    }
}

// function setSettings(settingTheme: string, settingPlayer: string, settingBoardSize: string){
//     setSetting(themeTypes, "theme", settingTheme)
//     setSetting(playerTypes, "player", settingPlayer)
//     setSetting(boardSizeTypes, "board-size", settingBoardSize)
// }

// function setSetting(settingTypes: string[], setting: string, selection: string | undefined){
//     for (const settingType of settingTypes){
//         const id = setting  + "-" + settingType + "-id";
//         const inputRef = document.getElementById(id) as HTMLInputElement; 
//         inputRef.checked = selection === settingType ? true : false;
//     }
// }

function setSettingOverview(htmlId: string, setting: 'theme' | 'player' | 'board-size'){
    const settingRef = document.getElementById(htmlId);
    
    if (settingRef){
        switch(setting){
            case 'theme':
                const themeTextRef = document.getElementById(`${setting}-${settings?.getTheme()}-text-id`) as HTMLSpanElement;
                settingRef.innerText = themeTextRef.innerText;
                break;
            case 'player':
                const playerTextRef = document.getElementById(`${setting}-${settings?.getPlayer()}-text-id`) as HTMLSpanElement;
                settingRef.innerText = playerTextRef.innerText;
                break;
            case 'board-size':
                const boardSizeTextRef = document.getElementById(`${setting}-${settings?.getBoardSize()}-text-id`) as HTMLSpanElement;
                settingRef.innerText = boardSizeTextRef.innerText;
                break;
            default:
                console.error('Setting not available!');
        }
    }
}

function disableButton(){
    if(settings?.isAllSet()){
        document.getElementById('start-btn-id')?.classList.remove('start_btn--disabled');
        const slash1Ref = document.getElementById('slash1-id') as HTMLImageElement;
        const slash2Ref = document.getElementById('slash2-id') as HTMLImageElement;
        slash1Ref.src = "/assets/img/line_3_obliquely.png";
        slash2Ref.src = "/assets/img/line_3_obliquely.png";
    }
}