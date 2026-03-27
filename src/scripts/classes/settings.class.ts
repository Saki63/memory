import type {Theme, Player, BoardSize} from '../utils';
import {themeTypes, playerTypes, boardSizeTypes} from '../utils';

/**
 * Represents the application settings including theme, player, and board size.
 * Provides methods to manage, persist, and retrieve these settings.
 */
export class Settings{
    private theme: Theme;
    private player: Player;
    private boardSize: BoardSize;
    private settingsSet = {
        theme: false,
        player: false,
        boardSize: false,
    }

    /**
     * Creates a new Settings instance with default values.
     * Defaults:
     * - theme: "code_vibes"
     * - player: "blue"
     * - boardSize: "16"
     */
    constructor(){
        this.theme = 'code_vibes';
        this.player = 'blue';
        this.boardSize = '16';
    }

    /**
     * Sets the current theme and marks it as configured.
     *
     * @param theme - The theme to be applied
     */
    setTheme(theme: Theme){
        this.theme = theme;
        this.settingsSet.theme = true;
    }

    /**
     * Sets the current player and marks it as configured.
     *
     * @param player - The player to be selected
     */
    setPlayer(player: Player){
        this.player = player;
        this.settingsSet.player = true;
    }

    /**
     * Sets the board size and marks it as configured.
     *
     * @param boardSize - The board size to be applied
     */
    setBoardSize(boardSize: BoardSize){
        this.boardSize = boardSize;
        this.settingsSet.boardSize = true;
    }

    /**
     * Returns the currently selected theme.
     *
     * @returns The current theme
     */
    getTheme(){
        return this.theme;
    }

    /**
     * Returns the currently selected player.
     *
     * @returns The current player
     */
    getPlayer(){
        return this.player;
    }

    /**
     * Returns the currently selected board size.
     *
     * @returns The current board size
     */
    getBoardSize(){
        return this.boardSize;
    }

    /**
     * Reads settings from session storage based on the specified mode.
     *
     * @param mode - Determines which settings to load ("all", "theme", "player", or "boardSize")
     */
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

    /**
     * Reads the theme from session storage if available and valid.
     */
    readStorageTheme(){
        const storageTheme = sessionStorage.getItem('memory_setting_theme');
        if (storageTheme && themeTypes.includes(storageTheme)) this.theme = storageTheme as Theme;
    }

    /**
     * Reads the player from session storage if available and valid.
     */
    readStoragePlayer(){
        const storagePlayer = sessionStorage.getItem('memory_setting_player');
        if (storagePlayer && playerTypes.includes(storagePlayer)) this.player = storagePlayer as Player;
    }

    /**
     * Reads the board size from session storage if available and valid.
     */
    readStorageBoardSize(){
        const storageBoardSize = sessionStorage.getItem('memory_setting_boardSize');
        if (storageBoardSize && boardSizeTypes.includes(storageBoardSize)) this.boardSize = storageBoardSize as BoardSize;
    }

    /**
     * Writes all current settings to session storage.
     */
    writeStorage(){
        sessionStorage.setItem("memory_setting_theme", this.theme);
        sessionStorage.setItem("memory_setting_player", this.player);
        sessionStorage.setItem("memory_setting_boardSize", this.boardSize);
    }

    /**
     * Checks whether all required settings (theme, player, board size) have been set.
     *
     * @returns True if all settings are configured, otherwise false
     */
    isAllSet(){
        return this.settingsSet.theme && this.settingsSet.player && this.settingsSet.boardSize;
    }
}