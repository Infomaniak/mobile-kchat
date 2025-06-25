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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../base/environment/utils");
const functions_1 = require("../../../base/i18n/functions");
const functions_2 = require("../../../base/participants/functions");
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const functions_web_1 = require("../../../reactions/functions.web");
const actions_web_1 = require("../../actions.web");
const constants_1 = require("../../constants");
const functions_web_2 = require("../../functions.web");
const hooks_web_1 = require("../../hooks.web");
const HangupButton_1 = __importDefault(require("../HangupButton"));
const EndConferenceButton_1 = require("./EndConferenceButton");
const HangupMenuButton_1 = __importDefault(require("./HangupMenuButton"));
const LeaveConferenceButton_1 = require("./LeaveConferenceButton");
const OverflowMenuButton_1 = __importDefault(require("./OverflowMenuButton"));
const Separator_1 = __importDefault(require("./Separator"));
const useStyles = (0, mui_1.makeStyles)()(() => {
    return {
        contextMenu: {
            position: 'relative',
            right: 'auto',
            margin: 0,
            marginBottom: '8px',
            maxHeight: 'calc(100dvh - 100px)',
            minWidth: '240px'
        },
        hangupMenu: {
            position: 'relative',
            right: 'auto',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '8px',
            margin: 0,
            padding: '16px',
            marginBottom: '4px'
        }
    };
});
const Toolbox = ({ _buttonsWithNotifyClick, _chatOpen, _clientWidth, _customToolbarButtons, _dialog, _disabled, _endConferenceSupported, _hangupMenuVisible, _isMobile, _isNarrowLayout, _jwtDisabledButtons, _mainToolbarButtonsThresholds, _overflowDrawer, _overflowMenuVisible, _reactionsButtonEnabled, _shiftUp, _shouldDisplayReactionsButtons, _toolbarButtons, _visible, dispatch, t, toolbarButtons }) => {
    const { classes, cx } = useStyles();
    const _toolboxRef = (0, react_1.useRef)(null);
    (0, hooks_web_1.useKeyboardShortcuts)(toolbarButtons);
    (0, react_1.useEffect)(() => {
        if (!_visible) {
            if (document.activeElement instanceof HTMLElement
                && _toolboxRef.current?.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        }
    }, [_visible]);
    /**
     * Sets the visibility of the hangup menu.
     *
     * @param {boolean} visible - Whether or not the hangup menu should be
     * displayed.
     * @private
     * @returns {void}
     */
    const onSetHangupVisible = (0, react_1.useCallback)((visible) => {
        dispatch((0, actions_web_1.setHangupMenuVisible)(visible));
        dispatch((0, actions_web_1.setToolbarHovered)(visible));
    }, []);
    /**
     * Sets the visibility of the overflow menu.
     *
     * @param {boolean} visible - Whether or not the overflow menu should be
     * displayed.
     * @private
     * @returns {void}
     */
    const onSetOverflowVisible = (0, react_1.useCallback)((visible) => {
        dispatch((0, actions_web_1.setOverflowMenuVisible)(visible));
        dispatch((0, actions_web_1.setToolbarHovered)(visible));
    }, []);
    (0, react_1.useEffect)(() => {
        if (_hangupMenuVisible && !_visible) {
            onSetHangupVisible(false);
            dispatch((0, actions_web_1.setToolbarHovered)(false));
        }
    }, [_hangupMenuVisible, _visible]);
    (0, react_1.useEffect)(() => {
        if (_overflowMenuVisible && _dialog) {
            onSetOverflowVisible(false);
            dispatch((0, actions_web_1.setToolbarHovered)(false));
        }
    }, [_overflowMenuVisible, _dialog]);
    /**
     * Key handler for overflow/hangup menus.
     *
     * @param {KeyboardEvent} e - Esc key click to close the popup.
     * @returns {void}
     */
    const onEscKey = (0, react_1.useCallback)((e) => {
        if (e?.key === 'Escape') {
            e?.stopPropagation();
            _hangupMenuVisible && dispatch((0, actions_web_1.setHangupMenuVisible)(false));
            _overflowMenuVisible && dispatch((0, actions_web_1.setOverflowMenuVisible)(false));
        }
    }, [_hangupMenuVisible, _overflowMenuVisible]);
    /**
     * Sets the notify click mode for the buttons.
     *
     * @param {Object} buttons - The list of toolbar buttons.
     * @returns {void}
     */
    function setButtonsNotifyClickMode(buttons) {
        if (typeof APP === 'undefined' || (_buttonsWithNotifyClick?.size ?? 0) <= 0) {
            return;
        }
        Object.values(buttons).forEach((button) => {
            if (typeof button === 'object') {
                button.notifyMode = _buttonsWithNotifyClick.get(button.key);
            }
        });
    }
    /**
     * Returns all buttons that need to be rendered.
     *
     * @param {Object} state - The redux state.
     * @returns {Object} The visible buttons arrays .
     */
    function getVisibleButtons() {
        const buttons = (0, functions_web_2.getAllToolboxButtons)(_customToolbarButtons);
        const filteredButtons = Object.keys(buttons).filter(key => typeof key !== 'undefined' // filter invalid buttons that may be comming from config.mainToolbarButtons
            // override
            && !_jwtDisabledButtons.includes(key)
            && (0, functions_web_2.isButtonEnabled)(key, _toolbarButtons));
        setButtonsNotifyClickMode(buttons);
        const { order } = _mainToolbarButtonsThresholds.find(({ width }) => _clientWidth > width)
            || _mainToolbarButtonsThresholds[_mainToolbarButtonsThresholds.length - 1];
        const mainToolbarButtonKeysOrder = [
            ...order.filter(key => filteredButtons.includes(key)),
            ...constants_1.MAIN_TOOLBAR_BUTTONS_PRIORITY.filter(key => !order.includes(key) && filteredButtons.includes(key)),
            ...filteredButtons.filter(key => !order.includes(key) && !constants_1.MAIN_TOOLBAR_BUTTONS_PRIORITY.includes(key))
        ];
        const mainButtonsKeys = mainToolbarButtonKeysOrder.slice(0, order.length);
        const overflowMenuButtons = filteredButtons.reduce((acc, key) => {
            if (!mainButtonsKeys.includes(key)) {
                acc.push(buttons[key]);
            }
            return acc;
        }, []);
        // if we have 1 button in the overflow menu it is better to directly display it in the main toolbar by replacing
        // the "More" menu button with it.
        if (overflowMenuButtons.length === 1) {
            const button = overflowMenuButtons.shift()?.key;
            button && mainButtonsKeys.push(button);
        }
        return {
            mainMenuButtons: mainButtonsKeys.map(key => buttons[key]),
            overflowMenuButtons
        };
    }
    /**
     * Dispatches an action signaling the toolbar is not being hovered.
     *
     * @private
     * @returns {void}
     */
    function onMouseOut() {
        !_overflowMenuVisible && dispatch((0, actions_web_1.setToolbarHovered)(false));
    }
    /**
     * Dispatches an action signaling the toolbar is being hovered.
     *
     * @private
     * @returns {void}
     */
    function onMouseOver() {
        dispatch((0, actions_web_1.setToolbarHovered)(true));
    }
    /**
     * Toggle the toolbar visibility when tabbing into it.
     *
     * @returns {void}
     */
    const onTabIn = (0, react_1.useCallback)(() => {
        if (!_visible) {
            dispatch((0, actions_web_1.showToolbox)());
        }
    }, [_visible]);
    /**
     * Renders the toolbox content.
     *
     * @returns {ReactElement}
     */
    function renderToolboxContent() {
        const toolbarAccLabel = 'toolbar.accessibilityLabel.moreActionsMenu';
        const containerClassName = `toolbox-content${_isMobile || _isNarrowLayout ? ' toolbox-content-mobile' : ''}`;
        const { mainMenuButtons, overflowMenuButtons } = getVisibleButtons();
        const raiseHandInOverflowMenu = overflowMenuButtons.some(({ key }) => key === 'raisehand');
        const showReactionsInOverflowMenu = _shouldDisplayReactionsButtons
            && ((!_reactionsButtonEnabled && (raiseHandInOverflowMenu || _isNarrowLayout || _isMobile))
                || overflowMenuButtons.some(({ key }) => key === 'reactions'));
        const showRaiseHandInReactionsMenu = showReactionsInOverflowMenu && raiseHandInOverflowMenu;
        return (react_1.default.createElement("div", { className: containerClassName },
            react_1.default.createElement("div", { className: 'toolbox-content-wrapper', onFocus: onTabIn, ...(_isMobile ? {} : {
                    onMouseOut,
                    onMouseOver
                }) },
                react_1.default.createElement("div", { className: 'toolbox-content-items', ref: _toolboxRef },
                    mainMenuButtons.map(({ Content, key, ...rest }) => Content !== Separator_1.default && (react_1.default.createElement(Content, { ...rest, buttonKey: key, key: key }))),
                    Boolean(overflowMenuButtons.length) && (react_1.default.createElement(OverflowMenuButton_1.default, { ariaControls: 'overflow-menu', buttons: overflowMenuButtons.reduce((acc, val) => {
                            if (val.key === 'reactions' && showReactionsInOverflowMenu) {
                                return acc;
                            }
                            if (val.key === 'raisehand' && showRaiseHandInReactionsMenu) {
                                return acc;
                            }
                            if (acc.length) {
                                const prev = acc[acc.length - 1];
                                const group = prev[prev.length - 1].group;
                                if (group === val.group) {
                                    prev.push(val);
                                }
                                else {
                                    acc.push([val]);
                                }
                            }
                            else {
                                acc.push([val]);
                            }
                            return acc;
                        }, []), isOpen: _overflowMenuVisible, key: 'overflow-menu', onToolboxEscKey: onEscKey, onVisibilityChange: onSetOverflowVisible, showRaiseHandInReactionsMenu: showRaiseHandInReactionsMenu, showReactionsMenu: showReactionsInOverflowMenu })),
                    (0, functions_web_2.isButtonEnabled)('hangup', _toolbarButtons) && (_endConferenceSupported
                        ? react_1.default.createElement(HangupMenuButton_1.default, { ariaControls: 'hangup-menu', isOpen: _hangupMenuVisible, key: 'hangup-menu', notifyMode: _buttonsWithNotifyClick?.get('hangup-menu'), onVisibilityChange: onSetHangupVisible },
                            react_1.default.createElement(ContextMenu_1.default, { accessibilityLabel: t(toolbarAccLabel), className: classes.hangupMenu, hidden: false, inDrawer: _overflowDrawer, onKeyDown: onEscKey },
                                react_1.default.createElement(EndConferenceButton_1.EndConferenceButton, { buttonKey: 'end-meeting', notifyMode: _buttonsWithNotifyClick?.get('end-meeting') }),
                                react_1.default.createElement(LeaveConferenceButton_1.LeaveConferenceButton, { buttonKey: 'hangup', notifyMode: _buttonsWithNotifyClick?.get('hangup') })))
                        : react_1.default.createElement(HangupButton_1.default, { buttonKey: 'hangup', customClass: 'hangup-button', key: 'hangup-button', notifyMode: _buttonsWithNotifyClick.get('hangup'), visible: (0, functions_web_2.isButtonEnabled)('hangup', _toolbarButtons) }))))));
    }
    if (_disabled) {
        return null;
    }
    const rootClassNames = `new-toolbox ${_visible ? 'visible' : ''} ${_toolbarButtons.length ? '' : 'no-buttons'} ${_chatOpen ? 'shift-right' : ''}`;
    return (react_1.default.createElement("div", { className: cx(rootClassNames, _shiftUp && 'shift-up'), id: 'new-toolbox' }, renderToolboxContent()));
};
/**
 * Maps (parts of) the redux state to {@link Toolbox}'s React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Object} ownProps - The props explicitly passed.
 * @private
 * @returns {{}}
 */
function _mapStateToProps(state, ownProps) {
    const { conference } = state['features/base/conference'];
    const { isNarrowLayout } = state['features/base/responsive-ui'];
    const endConferenceSupported = conference?.isEndConferenceSupported() && (0, functions_2.isLocalParticipantModerator)(state);
    const { customToolbarButtons, iAmRecorder, iAmSipGateway } = state['features/base/config'];
    const { hangupMenuVisible, overflowMenuVisible, overflowDrawer } = state['features/toolbox'];
    const { clientWidth } = state['features/base/responsive-ui'];
    const toolbarButtons = ownProps.toolbarButtons || state['features/toolbox'].toolbarButtons;
    return {
        _buttonsWithNotifyClick: state['features/toolbox'].buttonsWithNotifyClick,
        _chatOpen: state['features/chat'].isOpen,
        _clientWidth: clientWidth,
        _customToolbarButtons: customToolbarButtons,
        _dialog: Boolean(state['features/base/dialog'].component),
        _disabled: Boolean(iAmRecorder || iAmSipGateway),
        _endConferenceSupported: Boolean(endConferenceSupported),
        _isMobile: (0, utils_1.isMobileBrowser)(),
        _jwtDisabledButtons: (0, functions_web_2.getJwtDisabledButtons)(state),
        _hangupMenuVisible: hangupMenuVisible,
        _isNarrowLayout: isNarrowLayout,
        _mainToolbarButtonsThresholds: state['features/toolbox'].mainToolbarButtonsThresholds,
        _overflowMenuVisible: overflowMenuVisible,
        _overflowDrawer: overflowDrawer,
        _reactionsButtonEnabled: (0, functions_web_1.isReactionsButtonEnabled)(state),
        _shiftUp: state['features/toolbox'].shiftUp,
        _shouldDisplayReactionsButtons: (0, functions_web_1.shouldDisplayReactionsButtons)(state),
        _toolbarButtons: toolbarButtons,
        _visible: (0, functions_web_2.isToolboxVisible)(state)
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(Toolbox));
