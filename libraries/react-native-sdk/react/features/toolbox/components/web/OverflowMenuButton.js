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
const Popover_web_1 = __importDefault(require("../../../base/popover/components/Popover.web"));
const ContextMenu_1 = __importDefault(require("../../../base/ui/components/web/ContextMenu"));
const ContextMenuItemGroup_1 = __importDefault(require("../../../base/ui/components/web/ContextMenuItemGroup"));
const actions_1 = require("../../../gifs/actions");
const functions_web_1 = require("../../../gifs/functions.web");
const ReactionEmoji_1 = __importDefault(require("../../../reactions/components/web/ReactionEmoji"));
const ReactionsMenu_1 = __importDefault(require("../../../reactions/components/web/ReactionsMenu"));
const constants_1 = require("../../../reactions/constants");
const functions_any_1 = require("../../../reactions/functions.any");
const types_1 = require("../../../reactions/types");
const constants_2 = require("../../constants");
const functions_web_2 = require("../../functions.web");
const Drawer_1 = __importDefault(require("./Drawer"));
const JitsiPortal_1 = __importDefault(require("./JitsiPortal"));
const OverflowToggleButton_1 = __importDefault(require("./OverflowToggleButton"));
const useStyles = (0, mui_1.makeStyles)()((_theme, { reactionsMenuHeight, overflowDrawer }) => {
    return {
        overflowMenuDrawer: {
            overflowY: 'scroll',
            height: `calc(${constants_2.DRAWER_MAX_HEIGHT})`
        },
        contextMenu: {
            position: 'relative',
            right: 'auto',
            margin: 0,
            marginBottom: '8px',
            maxHeight: overflowDrawer ? undefined : 'calc(100dvh - 100px)',
            paddingBottom: overflowDrawer ? undefined : 0,
            minWidth: '240px',
            overflow: 'hidden'
        },
        content: {
            position: 'relative',
            maxHeight: overflowDrawer
                ? `calc(100% - ${reactionsMenuHeight}px - 16px)` : `calc(100dvh - 100px - ${reactionsMenuHeight}px)`,
            overflowY: 'auto'
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        },
        reactionsPadding: {
            height: `${reactionsMenuHeight}px`
        }
    };
});
const OverflowMenuButton = ({ buttons, isOpen, onToolboxEscKey, onVisibilityChange, showRaiseHandInReactionsMenu, showReactionsMenu }) => {
    const overflowDrawer = (0, react_redux_1.useSelector)(functions_web_2.showOverflowDrawer);
    const reactionsQueue = (0, react_redux_1.useSelector)(functions_any_1.getReactionsQueue);
    const isGiphyVisible = (0, react_redux_1.useSelector)(functions_web_1.isGifsMenuOpen);
    const dispatch = (0, react_redux_1.useDispatch)();
    const onCloseDialog = (0, react_1.useCallback)(() => {
        onVisibilityChange(false);
        if (isGiphyVisible && !overflowDrawer) {
            dispatch((0, actions_1.setGifMenuVisibility)(false));
        }
    }, [onVisibilityChange, actions_1.setGifMenuVisibility, isGiphyVisible, overflowDrawer, dispatch]);
    const onOpenDialog = (0, react_1.useCallback)(() => {
        onVisibilityChange(true);
    }, [onVisibilityChange]);
    const onEscClick = (0, react_1.useCallback)((event) => {
        if (event.key === 'Escape' && isOpen) {
            event.preventDefault();
            event.stopPropagation();
            onCloseDialog();
        }
    }, [onCloseDialog]);
    const toggleDialogVisibility = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('overflow'));
        onVisibilityChange(!isOpen);
    }, [isOpen, onVisibilityChange]);
    const toolbarAccLabel = 'toolbar.accessibilityLabel.moreActionsMenu';
    const { t } = (0, react_i18next_1.useTranslation)();
    let reactionsMenuHeight = 0;
    if (showReactionsMenu) {
        reactionsMenuHeight = constants_1.REACTIONS_MENU_HEIGHT_DRAWER;
        if (!overflowDrawer) {
            reactionsMenuHeight = constants_1.REACTIONS_MENU_HEIGHT_IN_OVERFLOW_MENU;
        }
        if (!showRaiseHandInReactionsMenu) {
            reactionsMenuHeight -= constants_1.RAISE_HAND_ROW_HEIGHT;
        }
        if (!overflowDrawer && isGiphyVisible) {
            reactionsMenuHeight += constants_1.GIFS_MENU_HEIGHT_IN_OVERFLOW_MENU;
        }
    }
    const { classes } = useStyles({
        reactionsMenuHeight,
        overflowDrawer
    });
    const groupsJSX = buttons.map((buttonGroup) => (react_1.default.createElement(ContextMenuItemGroup_1.default, { key: `group-${buttonGroup[0].group}` }, buttonGroup.map(({ key, Content, ...rest }) => {
        const props = { ...rest };
        if (key !== 'reactions') {
            props.buttonKey = key;
            props.contextMenu = true;
            props.showLabel = true;
        }
        return (react_1.default.createElement(Content, { ...props, key: key }));
    }))));
    const overflowMenu = groupsJSX && (react_1.default.createElement(ContextMenu_1.default, { accessibilityLabel: t(toolbarAccLabel), className: classes.contextMenu, hidden: false, id: 'overflow-context-menu', inDrawer: overflowDrawer, onKeyDown: onToolboxEscKey },
        react_1.default.createElement("div", { className: classes.content }, groupsJSX),
        showReactionsMenu && (react_1.default.createElement("div", { className: classes.footer },
            react_1.default.createElement(ReactionsMenu_1.default, { parent: overflowDrawer ? types_1.IReactionsMenuParent.OverflowDrawer : types_1.IReactionsMenuParent.OverflowMenu, showRaisedHand: showRaiseHandInReactionsMenu })))));
    if (overflowDrawer) {
        return (react_1.default.createElement("div", { className: 'toolbox-button-wth-dialog context-menu' },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(OverflowToggleButton_1.default, { handleClick: toggleDialogVisibility, isOpen: isOpen, onKeyDown: onEscClick }),
                react_1.default.createElement(JitsiPortal_1.default, null,
                    react_1.default.createElement(Drawer_1.default, { isOpen: isOpen, onClose: onCloseDialog },
                        react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("div", { className: classes.overflowMenuDrawer },
                                overflowMenu,
                                react_1.default.createElement("div", { className: classes.reactionsPadding })))),
                    showReactionsMenu && react_1.default.createElement("div", { className: 'reactions-animations-overflow-container' }, reactionsQueue.map(({ reaction, uid }, index) => (react_1.default.createElement(ReactionEmoji_1.default, { index: index, key: uid, reaction: reaction, uid: uid }))))))));
    }
    return (react_1.default.createElement("div", { className: 'toolbox-button-wth-dialog context-menu' },
        react_1.default.createElement(Popover_web_1.default, { content: overflowMenu, headingId: 'overflow-context-menu', onPopoverClose: onCloseDialog, onPopoverOpen: onOpenDialog, position: 'top', trigger: 'click', visible: isOpen },
            react_1.default.createElement(OverflowToggleButton_1.default, { isMenuButton: true, isOpen: isOpen, onKeyDown: onEscClick })),
        showReactionsMenu && react_1.default.createElement("div", { className: 'reactions-animations-container' }, reactionsQueue.map(({ reaction, uid }, index) => (react_1.default.createElement(ReactionEmoji_1.default, { index: index, key: uid, reaction: reaction, uid: uid }))))));
};
exports.default = OverflowMenuButton;
