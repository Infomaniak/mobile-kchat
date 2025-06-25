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
const js_fetch_api_1 = require("@giphy/js-fetch-api");
const react_components_1 = require("@giphy/react-components");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const actions_any_1 = require("../../../chat/actions.any");
const constants_1 = require("../../../filmstrip/constants");
const actions_web_1 = require("../../../reactions/actions.web");
const types_1 = require("../../../reactions/types");
const Drawer_1 = __importDefault(require("../../../toolbox/components/web/Drawer"));
const JitsiPortal_1 = __importDefault(require("../../../toolbox/components/web/JitsiPortal"));
const actions_1 = require("../../actions");
const function_any_1 = require("../../function.any");
const OVERFLOW_DRAWER_PADDING = 16;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        gifsMenu: {
            width: '100%',
            marginBottom: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            '& div:focus': {
                border: '1px solid red !important',
                boxSizing: 'border-box'
            }
        },
        searchField: {
            marginBottom: theme.spacing(3)
        },
        gifContainer: {
            height: '245px',
            overflowY: 'auto'
        },
        logoContainer: {
            width: `calc(100% - ${constants_1.SCROLL_SIZE}px)`,
            backgroundColor: '#121119',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginTop: theme.spacing(1)
        },
        overflowDrawerMenu: {
            padding: theme.spacing(3),
            width: '100%',
            boxSizing: 'border-box',
            height: '100%'
        },
        overflowMenu: {
            height: '200px',
            width: '201px',
            marginBottom: '0px'
        },
        gifContainerOverflow: {
            flexGrow: 1
        },
        drawer: {
            display: 'flex',
            height: '100%'
        }
    };
});
/**
 * Gifs menu.
 *
 * @returns {ReactElement}
 */
function GifsMenu({ columns = 2, parent }) {
    const API_KEY = (0, react_redux_1.useSelector)(function_any_1.getGifAPIKey);
    const giphyFetch = new js_fetch_api_1.GiphyFetch(API_KEY);
    const [searchKey, setSearchKey] = (0, react_1.useState)();
    const { classes: styles, cx } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const isInOverflowMenu = parent === types_1.IReactionsMenuParent.OverflowDrawer || parent === types_1.IReactionsMenuParent.OverflowMenu;
    const { clientWidth } = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui']);
    const rating = (0, react_redux_1.useSelector)(function_any_1.getGifRating);
    const proxyUrl = (0, react_redux_1.useSelector)(function_any_1.getGiphyProxyUrl);
    const fetchGifs = (0, react_1.useCallback)(async (offset = 0) => {
        const options = {
            limit: 20,
            offset,
            rating
        };
        if (!searchKey) {
            return await giphyFetch.trending(options);
        }
        return await giphyFetch.search(searchKey, options);
    }, [searchKey]);
    const onDrawerClose = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.setGifMenuVisibility)(false));
    }, []);
    const handleGifClick = (0, react_1.useCallback)((gif, e) => {
        e?.stopPropagation();
        const url = (0, function_any_1.getGifUrl)(gif, proxyUrl);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createGifSentEvent)());
        (0, react_redux_1.batch)(() => {
            dispatch((0, actions_any_1.sendMessage)((0, function_any_1.formatGifUrlMessage)(url), true));
            dispatch((0, actions_web_1.toggleReactionsMenuVisibility)());
            isInOverflowMenu && onDrawerClose();
        });
    }, [dispatch, isInOverflowMenu]);
    const handleGifKeyPress = (0, react_1.useCallback)((gif, e) => {
        if (e.nativeEvent.keyCode === 13) {
            handleGifClick(gif, null);
        }
    }, [handleGifClick]);
    const handleSearchKeyChange = (0, react_1.useCallback)(value => {
        setSearchKey(value);
    }, []);
    const handleKeyDown = (0, react_1.useCallback)(e => {
        if (!document.activeElement) {
            return;
        }
        if (e.keyCode === 38) { // up arrow
            e.preventDefault();
            // if the first gif is focused move focus to the input
            if (document.activeElement.previousElementSibling === null) {
                const element = document.querySelector('.gif-input');
                element?.focus();
            }
            else {
                const element = document.activeElement.previousElementSibling;
                element?.focus();
            }
        }
        else if (e.keyCode === 40) { // down arrow
            e.preventDefault();
            // if the input is focused move focus to the first gif
            if (document.activeElement.classList.contains('gif-input')) {
                const element = document.querySelector('.giphy-gif');
                element?.focus();
            }
            else {
                const element = document.activeElement.nextElementSibling;
                element?.focus();
            }
        }
    }, []);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);
    // For some reason, the Grid component does not do an initial call on mobile.
    // This fixes that.
    (0, react_1.useEffect)(() => setSearchKey(''), []);
    (0, react_1.useEffect)(() => {
        if (proxyUrl) {
            (0, js_fetch_api_1.setServerUrl)(proxyUrl);
        }
    }, []);
    const onInputKeyPress = (0, react_1.useCallback)((e) => {
        e.stopPropagation();
    }, []);
    const gifMenu = (react_1.default.createElement("div", { className: cx(styles.gifsMenu, parent === types_1.IReactionsMenuParent.OverflowDrawer && styles.overflowDrawerMenu, parent === types_1.IReactionsMenuParent.OverflowMenu && styles.overflowMenu) },
        react_1.default.createElement(Input_1.default, { autoFocus: true, className: cx(styles.searchField, 'gif-input'), id: 'gif-search-input', onChange: handleSearchKeyChange, onKeyPress: onInputKeyPress, placeholder: t('giphy.search'), 
            // eslint-disable-next-line react/jsx-no-bind
            ref: inputElement => {
                inputElement?.focus();
                setTimeout(() => inputElement?.focus(), 200);
            }, type: 'text', value: searchKey ?? '' }),
        react_1.default.createElement("div", { className: cx(styles.gifContainer, parent === types_1.IReactionsMenuParent.OverflowDrawer && styles.gifContainerOverflow) },
            react_1.default.createElement(react_components_1.Grid, { columns: columns, fetchGifs: fetchGifs, gutter: 6, hideAttribution: true, key: searchKey, noLink: true, noResultsMessage: t('giphy.noResults'), onGifClick: handleGifClick, onGifKeyPress: handleGifKeyPress, width: parent === types_1.IReactionsMenuParent.OverflowDrawer
                    ? clientWidth - (2 * OVERFLOW_DRAWER_PADDING) - constants_1.SCROLL_SIZE
                    : parent === types_1.IReactionsMenuParent.OverflowMenu ? 201 : 320 })),
        react_1.default.createElement("div", { className: styles.logoContainer },
            react_1.default.createElement("span", null, "Powered by"),
            react_1.default.createElement("img", { alt: 'GIPHY Logo', src: 'images/GIPHY_logo.png' }))));
    return parent === types_1.IReactionsMenuParent.OverflowDrawer ? (react_1.default.createElement(JitsiPortal_1.default, null,
        react_1.default.createElement(Drawer_1.default, { className: styles.drawer, isOpen: true, onClose: onDrawerClose }, gifMenu))) : gifMenu;
}
exports.default = GifsMenu;
