"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_1 = require("../../../base/participants/actions");
const functions_2 = require("../../../base/participants/functions");
const GifsMenu_1 = __importDefault(require("../../../gifs/components/web/GifsMenu"));
const GifsMenuButton_1 = __importDefault(require("../../../gifs/components/web/GifsMenuButton"));
const functions_3 = require("../../../gifs/functions");
const actions_web_1 = require("../../../toolbox/actions.web");
const actions_any_1 = require("../../actions.any");
const actions_web_2 = require("../../actions.web");
const constants_1 = require("../../constants");
const types_1 = require("../../types");
const ReactionButton_1 = __importDefault(require("./ReactionButton"));
const useStyles = (0, mui_1.makeStyles)()((theme, props) => {
    const { parent, showRaisedHand, _isGifMenuVisible } = props;
    let reactionsMenuHeight = constants_1.REACTIONS_MENU_HEIGHT_DRAWER;
    if (parent === types_1.IReactionsMenuParent.OverflowDrawer || parent === types_1.IReactionsMenuParent.OverflowMenu) {
        if (parent === types_1.IReactionsMenuParent.OverflowMenu) {
            reactionsMenuHeight = constants_1.REACTIONS_MENU_HEIGHT_IN_OVERFLOW_MENU;
            if (_isGifMenuVisible) {
                reactionsMenuHeight += constants_1.GIFS_MENU_HEIGHT_IN_OVERFLOW_MENU;
            }
        }
        if (!showRaisedHand) {
            reactionsMenuHeight -= constants_1.RAISE_HAND_ROW_HEIGHT;
        }
    }
    return {
        reactionsMenuInOverflowMenu: {
            '&.reactions-menu': {
                '&.with-gif': {
                    width: 'inherit'
                },
                '.reactions-row': {
                    '.toolbox-icon': {
                        width: '24px',
                        height: '24px',
                        'span.emoji': {
                            width: '24px',
                            height: '24px',
                            lineHeight: '24px',
                            fontSize: '16px'
                        }
                    }
                },
                '.raise-hand-row': {
                    '.toolbox-icon': {
                        height: '32px'
                    }
                }
            }
        },
        overflow: {
            width: 'auto',
            paddingBottom: 'max(env(safe-area-inset-bottom, 0), 16px)',
            backgroundColor: theme.palette.ui01,
            boxShadow: 'none',
            borderRadius: 0,
            position: 'relative',
            boxSizing: 'border-box',
            height: `${reactionsMenuHeight}px`
        }
    };
});
const _getReactionButtons = (dispatch, t) => {
    let modifierKey = 'Alt';
    if (window.navigator?.platform) {
        if (window.navigator.platform.indexOf('Mac') !== -1) {
            modifierKey = '⌥';
        }
    }
    return Object.keys(constants_1.REACTIONS).map(key => {
        /**
         * Sends reaction message.
         *
         * @returns {void}
         */
        function doSendReaction() {
            dispatch((0, actions_any_1.addReactionToBuffer)(key));
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createReactionMenuEvent)(key));
        }
        return (react_1.default.createElement(ReactionButton_1.default, { accessibilityLabel: t(`toolbar.accessibilityLabel.${key}`), icon: constants_1.REACTIONS[key].emoji, key: key, 
            // eslint-disable-next-line react/jsx-no-bind
            onClick: doSendReaction, toggled: false, tooltip: `${t(`toolbar.${key}`)} (${modifierKey} + ${constants_1.REACTIONS[key].shortcutChar})` }));
    });
};
const ReactionsMenu = (props) => {
    const { _dockToolbox, _isGifEnabled, _isGifMenuVisible, _raisedHand, dispatch, parent, showRaisedHand = false } = props;
    const isInOverflowMenu = parent === types_1.IReactionsMenuParent.OverflowDrawer || parent === types_1.IReactionsMenuParent.OverflowMenu;
    const { classes, cx } = useStyles(props);
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => {
        _dockToolbox(true);
        return () => {
            _dockToolbox(false);
        };
    }, []);
    const _doToggleRaiseHand = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.raiseHand)(!_raisedHand));
    }, [_raisedHand]);
    const _onToolbarToggleRaiseHand = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('raise.hand', { enable: !_raisedHand }));
        _doToggleRaiseHand();
        dispatch((0, actions_web_2.toggleReactionsMenuVisibility)());
    }, [_raisedHand]);
    const buttons = _getReactionButtons(dispatch, t);
    if (_isGifEnabled) {
        buttons.push(react_1.default.createElement(GifsMenuButton_1.default, { parent: parent }));
    }
    return (react_1.default.createElement("div", { className: cx('reactions-menu', parent === types_1.IReactionsMenuParent.OverflowMenu && classes.reactionsMenuInOverflowMenu, _isGifEnabled && 'with-gif', isInOverflowMenu && `overflow ${classes.overflow}`) },
        _isGifEnabled && _isGifMenuVisible
            && react_1.default.createElement(GifsMenu_1.default, { columns: parent === types_1.IReactionsMenuParent.OverflowMenu ? 1 : undefined, parent: parent }),
        react_1.default.createElement("div", { className: 'reactions-row' }, buttons),
        showRaisedHand && (react_1.default.createElement("div", { className: 'raise-hand-row' },
            react_1.default.createElement(ReactionButton_1.default, { accessibilityLabel: t('toolbar.accessibilityLabel.raiseHand'), icon: '\u270B', key: 'raisehand', label: `${t(`toolbar.${_raisedHand ? 'lowerYourHand' : 'raiseYourHand'}`)}
                                ${isInOverflowMenu ? '' : ' (R)'}`, onClick: _onToolbarToggleRaiseHand, toggled: true })))));
};
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
function mapStateToProps(state) {
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    return {
        _localParticipantID: localParticipant?.id,
        _isGifEnabled: (0, functions_3.isGifEnabled)(state),
        _isGifMenuVisible: (0, functions_3.isGifsMenuOpen)(state),
        _raisedHand: (0, functions_2.hasRaisedHand)(localParticipant)
    };
}
/**
 * Function that maps parts of Redux actions into component props.
 *
 * @param {Object} dispatch - Redux dispatch.
 * @returns {Object}
 */
function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        _dockToolbox: (dock) => dispatch((0, actions_web_1.dockToolbox)(dock))
    };
}
exports.default = (0, react_redux_1.connect)(mapStateToProps, mapDispatchToProps)(ReactionsMenu);
