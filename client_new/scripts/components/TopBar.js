define([
    'react',
    'game-logic/GameEngineStore',
    'stores/GameSettingsStore',
    'actions/GameSettingsActions',
    'game-logic/clib',
    'screenfull'
], function (
    React,
    Engine,
    GameSettingsStore,
    GameSettingsActions,
    Clib,
) {
    var D = React.DOM;

    GameSettingsActions.toggleTheme();

    function getState() {
        return {
            balanceBitsFormatted: Clib.formatSatoshis(Engine.balanceSatoshis),
            username: Engine.username,
            theme: GameSettingsStore.getCurrentTheme()//black || white
        };
    }

    return React.createClass({
        displayName: 'TopBar',
        mixins: [React.addons.PureRenderMixin],

        propTypes: {
            isMobileOrSmall: React.PropTypes.bool.isRequired
        },

        getInitialState: function () {
            var state = getState();
            state.fullScreen = false;
            return state;
        },

        componentDidMount: function () {
            Engine.on({
                joined: this._onChange,
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
            GameSettingsStore.on('all', this._onChange);
        },

        componentWillUnmount: function () {
            Engine.off({
                joined: this._onChange,
                game_started: this._onChange,
                game_crash: this._onChange,
                cashed_out: this._onChange
            });
            GameSettingsStore.off('all', this._onChange);
        },

        _onChange: function () {
            if (this.isMounted())
                this.setState(getState());
        },

        render: function () {

            var userLogin;
            if (this.state.username) {
                userLogin = D.div({ className: 'user-login' },
                    D.div({ className: 'balance-bits' },
                        D.span(null, 'Bits: '),
                        D.span({ className: 'balance' }, this.state.balanceBitsFormatted)
                    ),
                    D.div({ className: 'username' },
                        D.a({ href: '/account' }, this.state.username
                        ))
                );
            } else {
                userLogin = D.div({ className: 'user-login' },
                    D.div({ className: 'register' },
                        D.a({ href: '/register' }, 'Register')
                    ),
                    D.div({ className: 'login' },
                        D.a({ href: '/login' }, 'Log in')
                    )
                );
            }

            return D.div({ id: 'top-bar' },
                D.div({ className: 'title' },
                    D.a({ href: '/' },
                        D.h1(null, this.props.isMobileOrSmall ? 'SHIDO' : 'SHIDO Rocket Game')
                    ),
                    D.a({ href: '/leaderboard' }, D.h3('Leaderboard')),
                    D.a({ href: '/stats' }, D.h3('Stats')),
                    D.a({ href: '/faq' }, D.h3('Help'))
                ),
                userLogin,
            )
        }
    });
});