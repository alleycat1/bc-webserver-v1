define([
    'dispatcher/AppDispatcher',
    'constants/AppConstants',
    'lib/events',
    'lodash',
    'game-logic/clib'
], function (
    AppDispatcher,
    AppConstants,
    Events,
    _,
    Clib
) {
    var CHANGE_EVENT = 'change';

    var _themeFileName = '/css/' + (window.THEME_FILE_NAME || 'blackTheme.css'); //Global var sent by the server

    /** Theme **/
    var _currentTheme = Clib.localOrDef('currentTheme', 'white'); //black || white

    /** Display Settings **/
    var _controlsSize = Clib.localOrDef('controlsSize', 'big'); //big || small
    var _graphMode = Clib.localOrDef('graphMode', 'graphics'); //graphics || text
    var _controlsPosition = Clib.localOrDef('controlsPosition', 'right'); //right || left
    var _leftWidget = Clib.localOrDef('leftWidget', 'players'); //players || history || chat
    var _playerListSize = Clib.localOrDef('playerListSize', AppConstants.PlayerList.DEFAULT_PLAYER_LIST_SIZE);

    /** Hotkeys **/
    var _hotkeysActive = false; //true || false //Disabled by default!

    if (localStorage['currentTheme'] === 'black')
        Clib.loadCss(_themeFileName, 'theme-black');

    /**
     * List of ignored users client side. Some components speed up rendering by checking for
     * object identity for this list. Hence, it is crucial for correctness that no destructive
     * updates are performed on this object. Eventually, this can be replaced by an immutable Set.
     */
    var _ignoredClientList = JSON.parse(Clib.localOrDef('ignoredList', '{}'));


    //Singleton ControlsStore Object
    var GameSettingsStore = _.extend({}, Events, {

        emitChange: function () {
            this.trigger(CHANGE_EVENT);
        },

        addChangeListener: function (callback) {
            this.on(CHANGE_EVENT, callback);
        },

        removeChangeListener: function (callback) {
            this.off(CHANGE_EVENT, callback);
        },

        _toggleTheme: function () {
            Clib.loadCss(_themeFileName, 'theme-black');
            _currentTheme = 'black';
            localStorage['currentTheme'] = _currentTheme;
        },

        _setGraphMode: function (graphMode) {
            _graphMode = graphMode;
            localStorage['graphMode'] = graphMode;
        },

        _setPlayerListSize: function (playerListSize) {
            _playerListSize = playerListSize;
            localStorage['playerListSize'] = playerListSize;
        },

        _setControlsSize: function (controlsSize) {
            _controlsSize = controlsSize;
            localStorage['controlsSize'] = controlsSize;
        },

        _toggleHotkeysState: function () {
            _hotkeysActive = !_hotkeysActive;
        },

        _ignoreUser: function (username) {
            // Non-destructive update
            _ignoredClientList = _.assign({}, _ignoredClientList);
            _ignoredClientList[username.toLowerCase()] = { username: username };
            localStorage['ignoredList'] = JSON.stringify(_ignoredClientList);
        },

        _approveUser: function (username) {
            username = username.toLowerCase();
            if (_ignoredClientList[username]) {
                // Non-destructive update
                _ignoredClientList = _.assign({}, _ignoredClientList);
                delete _ignoredClientList[username];
                localStorage['ignoredList'] = JSON.stringify(_ignoredClientList);
            }
        },

        getState: function () {
            return {
                graphMode: _graphMode,
                controlsSize: _controlsSize,
                controlsPosition: _controlsPosition,
                leftWidget: _leftWidget,
                hotkeysActive: _hotkeysActive,
                playerListSize: _playerListSize,
                currentTheme: _currentTheme
            };
        },

        getCurrentTheme: function () {
            return _currentTheme;
        },

        getIgnoredClientList: function () {
            return _ignoredClientList;
        }

    });

    AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch (action.actionType) {
            case AppConstants.ActionTypes.TOGGLE_THEME:
                GameSettingsStore._toggleTheme();
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.SET_CONTROLS_SIZE:
                GameSettingsStore._setControlsSize(action.controlsSize);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.SET_GRAPH_MODE:
                GameSettingsStore._setGraphMode(action.graphMode);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.SET_PLAYER_LIST_SIZE:
                GameSettingsStore._setPlayerListSize(action.playerListSize);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.TOGGLE_HOYTKEYS_STATE:
                GameSettingsStore._toggleHotkeysState();
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.IGNORE_USER:
                GameSettingsStore._ignoreUser(action.username);
                GameSettingsStore.emitChange();
                break;

            case AppConstants.ActionTypes.APPROVE_USER:
                GameSettingsStore._approveUser(action.username);
                GameSettingsStore.emitChange();
                break;

            //case AppConstants.ActionTypes.SET_CONTROLS_POSITION:
            //    GameSettingsStore._setGraphMode(action.graphMode);
            //    GameSettingsStore.emitChange();
            //    break;
            //
            //case AppConstants.ActionTypes.SET_LEFT_WIDGET:
            //    GameSettingsStore._setGraphMode(action.graphMode);
            //    GameSettingsStore.emitChange();
            //    break;

        }

        return true; // No errors. Needed by promise in Dispatcher.
    });

    return GameSettingsStore;
});