define(['lib/key-mirror'], function (KeyMirror) {

    return {

        ActionTypes: KeyMirror({

            //Admin Actions
            ADMIN_PAUSE_GAME: null,
            ADMIN_RESUME_GAME: null,

            //Game Actions
            PLACE_BET: null,
            PLACE_BET_SUCCESS: null,
            PLACE_BET_ERROR: null,
            CANCEL_BET: null,
            CASH_OUT: null,
            SAY_CHAT: null,

            //Strategy Actions
            RUN_STRATEGY: null,
            STOP_SCRIPT: null,
            UPDATE_SCRIPT: null,
            SELECT_STRATEGY: null,
            SET_WIDGET_STATE: null,

            //Tab Selector
            SELECT_TAB: null,

            //Controls Selector
            SELECT_CONTROL: null,
            TOGGLE_CONTROL: null,

            //Controls
            SET_BET_SIZE: null,
            SET_AUTO_CASH_OUT: null,

            //Chat
            SET_CHAT_INPUT_TEXT: null,
            IGNORE_USER: null,
            CLIENT_MESSAGE: null,
            APPROVE_USER: null,
            LIST_MUTED_USERS: null,
            SET_BOTS_DISPLAY_MODE: null,
            JOIN_CHANNEL: null,
            CLOSE_CURRENT_CHANNEL: null,

            //Game Settings
            TOGGLE_THEME: null,
            SET_CONTROLS_SIZE: null,
            SET_GRAPH_MODE: null,
            SET_CONTROLS_POSITION: null,
            SET_PLAYER_LIST_SIZE: null,
            SET_LEFT_WIDGET: null,
            TOGGLE_HOYTKEYS_STATE: null,

            //Hotkeys
            DOUBLE_BET: null,
            HALF_BET: null,
            //PLACE_BET (GAME ACTIONS)

            //Chart
            SELECT_CHART: null
        }),

        PayloadSources: KeyMirror({
            VIEW_ACTION: null
        }),

        Engine: {
            STOP_PREDICTING_LAPSE: 300,
            HOST: (window.document.location.host === 'crash.magicdex.app' || window.DEV_OTT) ? 'https://crashengine.magicdex.app:443' : window.document.location.host.replace(/:3841$/, ':3842'),
            GAME_API_VERSION: 1,
            CHAT_HOST: window.document.location.host,
            IDLE_TIMEOUT: 5 * 60 * 1000, // 5 minutes
            MAX_BET: 100000000 /** Max bet per game 1,000,000 SHIDOs, this will be calculated dynamically in the future, based on the invested amount in the casino **/
        },

        BetButton: {
            INITIAL_DISABLE_TIME: 500 //The time the button is disabled after cashing out and after the game crashes
        },

        Chat: {
            MAX_LENGTH: 500
        },

        PlayerList: {
            DEFAULT_PLAYER_LIST_SIZE: 30
        },

        Animations: {
            NYAN_CAT_TRIGGER_MS: 115129 //115129ms ~ 1000x // 11552ms ~ 2x
        }

    }

});

