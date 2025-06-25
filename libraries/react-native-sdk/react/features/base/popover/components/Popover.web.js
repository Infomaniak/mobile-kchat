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
const react_focus_on_1 = require("react-focus-on");
const react_redux_1 = require("react-redux");
const DialogPortal_1 = __importDefault(require("../../../toolbox/components/web/DialogPortal"));
const Drawer_1 = __importDefault(require("../../../toolbox/components/web/Drawer"));
const JitsiPortal_1 = __importDefault(require("../../../toolbox/components/web/JitsiPortal"));
const functions_web_1 = require("../../ui/functions.web");
const functions_web_2 = require("../functions.web");
/**
 * Implements a React {@code Component} for showing an {@code Popover} on
 * mouseenter of the trigger and contents, and hiding the dialog on mouseleave.
 *
 * @augments Component
 */
class Popover extends react_1.Component {
    /**
     * Initializes a new {@code Popover} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            contextMenuStyle: null,
            enableFocusLock: false
        };
        // Bind event handlers so they are only bound once for every instance.
        this._enableFocusLock = this._enableFocusLock.bind(this);
        this._onHideDialog = this._onHideDialog.bind(this);
        this._onShowDialog = this._onShowDialog.bind(this);
        this._onKeyPress = this._onKeyPress.bind(this);
        this._containerRef = react_1.default.createRef();
        this._onEscKey = this._onEscKey.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._setContextMenuRef = this._setContextMenuRef.bind(this);
        this._setContextMenuStyle = this._setContextMenuStyle.bind(this);
        this._getCustomDialogStyle = this._getCustomDialogStyle.bind(this);
        this._onOutsideClick = this._onOutsideClick.bind(this);
    }
    /**
     * Sets up a touch event listener to attach.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        window.addEventListener('touchstart', this._onTouchStart);
        if (this.props.trigger === 'click') {
            // @ts-ignore
            window.addEventListener('click', this._onOutsideClick);
        }
    }
    /**
     * Removes the listener set up in the {@code componentDidMount} method.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('touchstart', this._onTouchStart);
        if (this.props.trigger === 'click') {
            // @ts-ignore
            window.removeEventListener('click', this._onOutsideClick);
        }
    }
    /**
     * Handles click outside the popover.
     *
     * @param {MouseEvent} e - The click event.
     * @returns {void}
     */
    _onOutsideClick(e) {
        if (!this._containerRef?.current?.contains(e.target) && this.props.visible) {
            this._onHideDialog();
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { children, className, content, focusable, headingId, id, overflowDrawer, visible, trigger } = this.props;
        if (overflowDrawer) {
            return (react_1.default.createElement("div", { className: className, id: id, onClick: this._onShowDialog },
                children,
                react_1.default.createElement(JitsiPortal_1.default, null,
                    react_1.default.createElement(Drawer_1.default, { headingId: headingId, isOpen: visible, onClose: this._onHideDialog }, content))));
        }
        return (react_1.default.createElement("div", { className: className, id: id, onClick: this._onClick, onKeyPress: this._onKeyPress, ...(trigger === 'hover' ? {
                onMouseEnter: this._onShowDialog,
                onMouseLeave: this._onHideDialog
            } : {}), ...(trigger === 'hover' && focusable && {
                role: 'button',
                tabIndex: 0
            }), ref: this._containerRef },
            visible && (react_1.default.createElement(DialogPortal_1.default, { getRef: this._setContextMenuRef, onVisible: this._isInteractive() ? this._enableFocusLock : undefined, setSize: this._setContextMenuStyle, style: this.state.contextMenuStyle, targetSelector: '.popover-content' },
                react_1.default.createElement(react_focus_on_1.FocusOn
                // Use the `enabled` prop instead of conditionally rendering ReactFocusOn
                // to prevent UI stutter on dialog appearance. It seems the focus guards generated annoy
                // our DialogPortal positioning calculations.
                , { 
                    // Use the `enabled` prop instead of conditionally rendering ReactFocusOn
                    // to prevent UI stutter on dialog appearance. It seems the focus guards generated annoy
                    // our DialogPortal positioning calculations.
                    enabled: Boolean(this._contextMenuRef) && this.state.enableFocusLock, returnFocus: 
                    // If we return the focus to an element outside the viewport the page will scroll to
                    // this element which in our case is undesirable and the element is outside of the
                    // viewport on purpose (to be hidden). For example if we return the focus to the
                    // toolbox when it is hidden the whole page will move up in order to show the
                    // toolbox. This is usually followed up with displaying the toolbox (because now it
                    // is on focus) but because of the animation the whole scenario looks like jumping
                    // large video.
                    functions_web_1.isElementInTheViewport, shards: this._contextMenuRef && [this._contextMenuRef] }, this._renderContent()))),
            children));
    }
    /**
     * Sets the context menu dialog style for positioning it on screen.
     *
     * @param {DOMRectReadOnly} size -The size info of the current context menu.
     *
     * @returns {void}
     */
    _setContextMenuStyle(size) {
        const style = this._getCustomDialogStyle(size);
        this.setState({ contextMenuStyle: style });
    }
    /**
     * Sets the context menu's ref.
     *
     * @param {HTMLElement} elem -The html element of the context menu.
     *
     * @returns {void}
     */
    _setContextMenuRef(elem) {
        if (!elem || document.body.contains(elem)) {
            this._contextMenuRef = elem;
        }
    }
    /**
     * Hide dialog on touch outside of the context menu.
     *
     * @param {TouchEvent} event - The touch event.
     * @private
     * @returns {void}
     */
    _onTouchStart(event) {
        if (this.props.visible
            && !this.props.overflowDrawer
            && this._contextMenuRef
            && this._contextMenuRef.contains
            && !this._contextMenuRef.contains(event.target)
            && !this._containerRef?.current?.contains(event.target)) {
            this._onHideDialog();
        }
    }
    /**
     * Stops displaying the {@code Popover}.
     *
     * @private
     * @returns {void}
     */
    _onHideDialog() {
        this.setState({
            contextMenuStyle: null
        });
        if (this.props.onPopoverClose) {
            this.props.onPopoverClose();
        }
    }
    /**
     * Displays the {@code Popover} and calls any registered onPopoverOpen
     * callbacks.
     *
     * @param {Object} event - The mouse event or the keypress event to intercept.
     * @private
     * @returns {void}
     */
    _onShowDialog(event) {
        event?.stopPropagation();
        if (!this.props.disablePopover) {
            this.props.onPopoverOpen?.();
        }
    }
    /**
     * Prevents switching from tile view to stage view on accidentally clicking
     * the popover thumbs.
     *
     * @param {Object} event - The mouse event or the keypress event to intercept.
     * @private
     * @returns {void}
     */
    _onClick(event) {
        const { allowClick, trigger, focusable, visible } = this.props;
        if (!allowClick) {
            event.stopPropagation();
        }
        if (trigger === 'click' || focusable) {
            if (visible) {
                this._onHideDialog();
            }
            else {
                this._onShowDialog();
            }
        }
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onKeyPress(e) {
        // first check that the element we pressed is the actual popover toggle or any of its descendant,
        // otherwise pressing space or enter in any child element of the popover _dialog_ will trigger this.
        if (e.currentTarget.contains(e.target) && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            if (this.props.visible) {
                this._onHideDialog();
            }
            else {
                this._onShowDialog(e);
            }
        }
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onEscKey(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            e.stopPropagation();
            if (this.props.visible) {
                this._onHideDialog();
            }
        }
    }
    /**
     * Gets style for positioning the context menu on screen in regards to the trigger's
     * position.
     *
     * @param {DOMRectReadOnly} size -The current context menu's size info.
     *
     * @returns {Object} - The new style of the context menu.
     */
    _getCustomDialogStyle(size) {
        if (this._containerRef?.current) {
            const bounds = this._containerRef.current.getBoundingClientRect();
            return (0, functions_web_2.getContextMenuStyle)(bounds, size, this.props.position);
        }
    }
    /**
     * Renders the React Element to be displayed in the {@code Popover}.
     * Also adds padding to support moving the mouse from the trigger to the
     * dialog to prevent mouseleave events.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderContent() {
        const { content, position, trigger, headingId, headingLabel } = this.props;
        return (react_1.default.createElement("div", { className: `popover ${trigger}` },
            react_1.default.createElement("div", { className: `popover-content ${position.split('-')[0]}`, "data-autofocus": this.state.enableFocusLock, onKeyDown: this._onEscKey, ...(this.state.enableFocusLock && {
                    'aria-modal': true,
                    'aria-label': !headingId && headingLabel ? headingLabel : undefined,
                    'aria-labelledby': headingId,
                    role: 'dialog',
                    tabIndex: -1
                }) }, content)));
    }
    /**
     * Returns whether the popover is considered interactive or not.
     *
     * Interactive means the popover content is certainly composed of buttons, links…
     * Non-interactive popovers are mostly tooltips.
     *
     * @private
     * @returns {boolean}
     */
    _isInteractive() {
        return this.props.trigger === 'click' || Boolean(this.props.focusable);
    }
    /**
     * Enables the focus lock in the popover dialog.
     *
     * @private
     * @returns {void}
     */
    _enableFocusLock() {
        this.setState({ enableFocusLock: true });
    }
}
/**
 * Default values for {@code Popover} component's properties.
 *
 * @static
 */
Popover.defaultProps = {
    className: '',
    focusable: true,
    id: '',
    trigger: 'hover'
};
/**
 * Maps (parts of) the Redux state to the associated {@code Popover}'s props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        overflowDrawer: state['features/toolbox'].overflowDrawer
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(Popover);
