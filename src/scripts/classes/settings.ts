
type Theme = 'code_vibes' | 'food';
type Player = 'blue' | 'orange';
type BoardSize = '16' | '24' | '36';

const themeTypes = ['code_vibes', 'food'];
const playerTypes = ['blue', 'orange'];
const boardSizeTypes = ['16', '24', '36'];

let settings: Settings | undefined = undefined;

class Settings{
    private theme: Theme;
    private player: Player;
    private boardSize: BoardSize;

    constructor(){
        this.theme = 'code_vibes';
        this.player = 'blue';
        this.boardSize = '16';
    }

    setTheme(theme: Theme){
        this.theme = theme;
    }

    setPlayer(player: Player){
        this.player = player;
    }

    setBoardSize(boardSize: BoardSize){
        this.boardSize = boardSize;
    }

    getTheme(){
        return this.theme;
    }

    getPlayer(){
        return this.player;
    }

    getBoardSize(){
        return this.boardSize;
    }


    readStorage(mode: 'all' | 'theme' | 'player' | 'boardSize'){
        if (mode === 'all'){
            this.readStorageTheme();
            this.readStoragePlayer();
            this.readStorageBoardSize();
        }
        else if (mode === 'theme'){
            this.readStorageTheme();
        }
        else if (mode === 'player'){
            this.readStoragePlayer();
        }         
        else if (mode === 'boardSize'){
            this.readStorageBoardSize();
        }
    }

    readStorageTheme(){
        const storageTheme = localStorage.getItem('memory_setting_theme');
        if (storageTheme && themeTypes.includes(storageTheme)) this.theme = storageTheme as Theme;
    }

    readStoragePlayer(){
        const storagePlayer = localStorage.getItem('memory_setting_player');
        if (storagePlayer && playerTypes.includes(storagePlayer)) this.player = storagePlayer as Player;
    }

    readStorageBoardSize(){
        const storageBoardSize = localStorage.getItem('memory_setting_boardSize');
        if (storageBoardSize && boardSizeTypes.includes(storageBoardSize)) this.boardSize = storageBoardSize as BoardSize;
    }

    writeStorage(){
        localStorage.setItem("memory_setting_theme", this.theme);
        localStorage.setItem("memory_setting_player", this.player);
        localStorage.setItem("memory_setting_boardSize", this.boardSize);
    }
}

function initSettingsPage(){
    settings = new Settings();
    settings.readStorage('all');
    setSettings(settings.getTheme(), settings.getPlayer(), settings.getBoardSize());
    setThemeCover(settings.getTheme());
}

function initBoardPage(){
    settings = new Settings();
    settings.readStorage('all');
}


//listener - settings ---------------------------------------------------------------------------------------------
function changeTheme(theme: Theme){
    settings?.setTheme(theme);
    setThemeCover(theme);
}

function changePlayer(player: Player){
    settings?.setPlayer(player);
}

function changeBoardSize(boardSize: BoardSize){
    settings?.setBoardSize(boardSize);
}

function saveSettings(){
    settings?.writeStorage();
}


//dom manipulation - settings --------------------------------------------------------------------------------------
function setThemeCover(theme: Theme){
    const themeImgRef = document.getElementById('theme_cover');
    if (themeImgRef){
        themeImgRef.setAttribute('src', "/assets/img/theme_cover/"+ theme + ".png");
    }
}

function setSettings(settingTheme: string, settingPlayer: string, settingBoardSize: string){
    setSetting(themeTypes, "theme", settingTheme)
    setSetting(playerTypes, "player", settingPlayer)
    setSetting(boardSizeTypes, "board_size", settingBoardSize)
}

function setSetting(settingTypes: string[], setting: string, selection: string | undefined){
    for (const settingType of settingTypes){
        const id = setting  + "_" + settingType + "_id";
        const inputRef = document.getElementById(id) as HTMLInputElement; 
        inputRef.checked = selection === settingType ? true : false;
    }
}