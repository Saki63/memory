import type {Theme, Player, BoardSize} from '../utils';
import {themeTypes, playerTypes, boardSizeTypes} from '../utils';

export class Settings{
    private theme: Theme;
    private player: Player;
    private boardSize: BoardSize;
    private settingsSet = {
        theme: false,
        player: false,
        boardSize: false,
    }

    constructor(){
        this.theme = 'code_vibes';
        this.player = 'blue';
        this.boardSize = '16';
    }

    setTheme(theme: Theme){
        this.theme = theme;
        this.settingsSet.theme = true;
    }

    setPlayer(player: Player){
        this.player = player;
        this.settingsSet.player = true;
    }

    setBoardSize(boardSize: BoardSize){
        this.boardSize = boardSize;
        this.settingsSet.boardSize = true;
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
        const storageTheme = sessionStorage.getItem('memory_setting_theme');
        if (storageTheme && themeTypes.includes(storageTheme)) this.theme = storageTheme as Theme;
    }

    readStoragePlayer(){
        const storagePlayer = sessionStorage.getItem('memory_setting_player');
        if (storagePlayer && playerTypes.includes(storagePlayer)) this.player = storagePlayer as Player;
    }

    readStorageBoardSize(){
        const storageBoardSize = sessionStorage.getItem('memory_setting_boardSize');
        if (storageBoardSize && boardSizeTypes.includes(storageBoardSize)) this.boardSize = storageBoardSize as BoardSize;
    }

    writeStorage(){
        sessionStorage.setItem("memory_setting_theme", this.theme);
        sessionStorage.setItem("memory_setting_player", this.player);
        sessionStorage.setItem("memory_setting_boardSize", this.boardSize);
    }

    isAllSet(){
        return this.settingsSet.theme && this.settingsSet.player && this.settingsSet.boardSize;
    }
}