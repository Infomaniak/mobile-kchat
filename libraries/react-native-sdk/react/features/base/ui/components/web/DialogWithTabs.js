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
const actions_1 = require("../../../dialog/actions");
const svg_1 = require("../../../icons/svg");
const functions_web_1 = require("../../../styles/functions.web");
const BaseDialog_1 = __importDefault(require("./BaseDialog"));
const Button_1 = __importDefault(require("./Button"));
const ClickableIcon_1 = __importDefault(require("./ClickableIcon"));
const ContextMenuItem_1 = __importDefault(require("./ContextMenuItem"));
const MOBILE_BREAKPOINT = 607;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialog: {
            flexDirection: 'row',
            height: '560px',
            '@media (min-width: 608px) and (max-width: 712px)': {
                width: '560px'
            },
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0
            },
            '@media (max-width: 448px)': {
                height: '100%'
            }
        },
        sidebar: {
            display: 'flex',
            flexDirection: 'column',
            minWidth: '211px',
            maxWidth: '100%',
            borderRight: `1px solid ${theme.palette.ui03}`,
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                width: '100%',
                borderRight: 'none'
            }
        },
        menuItemMobile: {
            paddingLeft: '24px'
        },
        titleContainer: {
            margin: 0,
            padding: '24px',
            paddingRight: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                padding: '16px 24px'
            }
        },
        title: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading5),
            color: `${theme.palette.text01} !important`,
            margin: 0,
            padding: 0
        },
        contentContainer: {
            position: 'relative',
            display: 'flex',
            padding: '24px',
            flexDirection: 'column',
            overflow: 'hidden',
            width: '100%',
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                padding: '0'
            }
        },
        buttonContainer: {
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexGrow: 0,
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                justifyContent: 'space-between',
                padding: '16px 24px'
            }
        },
        backContainer: {
            display: 'flex',
            flexDirection: 'row-reverse',
            alignItems: 'center',
            '& > button': {
                marginRight: '24px'
            }
        },
        content: {
            flexGrow: 1,
            overflowY: 'auto',
            width: '100%',
            boxSizing: 'border-box',
            [`@media (max-width: ${MOBILE_BREAKPOINT}px)`]: {
                padding: '0 24px'
            }
        },
        header: {
            order: -1,
            paddingBottom: theme.spacing(4)
        },
        footer: {
            justifyContent: 'flex-end',
            paddingTop: theme.spacing(4),
            '& button:last-child': {
                marginLeft: '16px'
            }
        }
    };
});
const DialogWithTabs = ({ className, defaultTab, titleKey, tabs }) => {
    const { classes, cx } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const [selectedTab, setSelectedTab] = (0, react_1.useState)(defaultTab ?? tabs[0].name);
    const [userSelected, setUserSelected] = (0, react_1.useState)(false);
    const [tabStates, setTabStates] = (0, react_1.useState)(tabs.map(tab => tab.props));
    const clientWidth = (0, react_redux_1.useSelector)((state) => state['features/base/responsive-ui'].clientWidth);
    const [isMobile, setIsMobile] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (clientWidth <= MOBILE_BREAKPOINT) {
            !isMobile && setIsMobile(true);
        }
        else {
            isMobile && setIsMobile(false);
        }
    }, [clientWidth, isMobile]);
    (0, react_1.useEffect)(() => {
        if (isMobile) {
            setSelectedTab(defaultTab);
        }
        else {
            setSelectedTab(defaultTab ?? tabs[0].name);
        }
    }, [isMobile]);
    const onUserSelection = (0, react_1.useCallback)((tabName) => {
        setUserSelected(true);
        setSelectedTab(tabName);
    }, []);
    const back = (0, react_1.useCallback)(() => {
        onUserSelection(undefined);
    }, []);
    // the userSelected state is used to prevent setting focus when the user
    // didn't actually interact (for the first rendering for example)
    (0, react_1.useEffect)(() => {
        if (userSelected) {
            document.querySelector(isMobile
                ? `.${classes.title}`
                : `#${`dialogtab-button-${selectedTab}`}`)?.focus();
            setUserSelected(false);
        }
    }, [isMobile, userSelected, selectedTab]);
    const onClose = (0, react_1.useCallback)((isCancel = true) => {
        if (isCancel) {
            tabs.forEach(({ cancel }) => {
                cancel && dispatch(cancel());
            });
        }
        dispatch((0, actions_1.hideDialog)());
    }, []);
    const onClick = (0, react_1.useCallback)((tabName) => () => {
        onUserSelection(tabName);
    }, []);
    const onTabKeyDown = (0, react_1.useCallback)((index) => (event) => {
        let newTab = null;
        if (event.key === 'ArrowUp') {
            newTab = index === 0 ? tabs[tabs.length - 1] : tabs[index - 1];
        }
        if (event.key === 'ArrowDown') {
            newTab = index === tabs.length - 1 ? tabs[0] : tabs[index + 1];
        }
        if (newTab !== null) {
            onUserSelection(newTab.name);
        }
    }, [tabs.length]);
    const onMobileKeyDown = (0, react_1.useCallback)((tabName) => (event) => {
        if (event.key === ' ' || event.key === 'Enter') {
            onUserSelection(tabName);
        }
    }, [classes.contentContainer]);
    const getTabProps = (tabId) => {
        const tabConfiguration = tabs[tabId];
        const currentTabState = tabStates[tabId];
        if (tabConfiguration.propsUpdateFunction) {
            return tabConfiguration.propsUpdateFunction(currentTabState ?? {}, tabConfiguration.props ?? {}, tabStates);
        }
        return { ...currentTabState };
    };
    const onTabStateChange = (0, react_1.useCallback)((tabId, state) => {
        const newTabStates = [...tabStates];
        newTabStates[tabId] = state;
        setTabStates(newTabStates);
    }, [tabStates]);
    const onSubmit = (0, react_1.useCallback)(() => {
        tabs.forEach(({ submit }, idx) => {
            submit?.(tabStates[idx]);
        });
        onClose(false);
    }, [tabs, tabStates]);
    const selectedTabIndex = (0, react_1.useMemo)(() => {
        if (selectedTab) {
            return tabs.findIndex(tab => tab.name === selectedTab);
        }
        return null;
    }, [selectedTab]);
    const selectedTabComponent = (0, react_1.useMemo)(() => {
        if (selectedTabIndex !== null) {
            const TabComponent = tabs[selectedTabIndex].component;
            return (react_1.default.createElement("div", { className: tabs[selectedTabIndex].className, key: tabs[selectedTabIndex].name },
                react_1.default.createElement(TabComponent, { onTabStateChange: onTabStateChange, tabId: selectedTabIndex, ...getTabProps(selectedTabIndex) })));
        }
        return null;
    }, [selectedTabIndex, tabStates]);
    const closeIcon = (0, react_1.useMemo)(() => (react_1.default.createElement(ClickableIcon_1.default, { accessibilityLabel: t('dialog.accessibilityLabel.close'), icon: svg_1.IconCloseLarge, id: 'modal-header-close-button', onClick: onClose })), [onClose]);
    return (react_1.default.createElement(BaseDialog_1.default, { className: cx(classes.dialog, className), onClose: onClose, size: 'large', titleKey: titleKey },
        (!isMobile || !selectedTab) && (react_1.default.createElement("div", { "aria-orientation": 'vertical', className: classes.sidebar, role: isMobile ? undefined : 'tablist' },
            react_1.default.createElement("div", { className: classes.titleContainer },
                react_1.default.createElement("h1", { className: classes.title, tabIndex: -1 }, t(titleKey ?? '')),
                isMobile && closeIcon),
            tabs.map((tab, index) => {
                const label = t(tab.labelKey);
                /**
                 * When not on mobile, the items behave as tabs,
                 * that's why we set `controls`, `role` and `selected` attributes
                 * only when not on mobile, they are useful only for the tab behavior.
                 */
                return (react_1.default.createElement(ContextMenuItem_1.default, { accessibilityLabel: label, className: cx(isMobile && classes.menuItemMobile), controls: isMobile ? undefined : `dialogtab-content-${tab.name}`, icon: tab.icon, id: `dialogtab-button-${tab.name}`, key: tab.name, onClick: onClick(tab.name), onKeyDown: isMobile ? onMobileKeyDown(tab.name) : onTabKeyDown(index), role: isMobile ? undefined : 'tab', selected: tab.name === selectedTab, text: label }));
            }))),
        (!isMobile || selectedTab) && (react_1.default.createElement("div", { className: classes.contentContainer, tabIndex: isMobile ? -1 : undefined },
            isMobile && (react_1.default.createElement("div", { className: cx(classes.buttonContainer, classes.header) },
                react_1.default.createElement("span", { className: classes.backContainer },
                    react_1.default.createElement("h1", { className: classes.title, tabIndex: -1 }, (selectedTabIndex !== null) && t(tabs[selectedTabIndex].labelKey)),
                    react_1.default.createElement(ClickableIcon_1.default, { accessibilityLabel: t('dialog.Back'), icon: svg_1.IconArrowBack, id: 'modal-header-back-button', onClick: back })),
                closeIcon)),
            tabs.map(tab => (react_1.default.createElement("div", { "aria-labelledby": isMobile ? undefined : `${tab.name}-button`, className: cx(classes.content, tab.name !== selectedTab && 'hide'), id: `dialogtab-content-${tab.name}`, key: tab.name, role: isMobile ? undefined : 'tabpanel', tabIndex: isMobile ? -1 : 0 }, tab.name === selectedTab && selectedTabComponent))),
            !isMobile && (react_1.default.createElement("div", { className: cx(classes.buttonContainer, classes.header) }, closeIcon)),
            react_1.default.createElement("div", { className: cx(classes.buttonContainer, classes.footer) },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('dialog.accessibilityLabel.Cancel'), id: 'modal-dialog-cancel-button', labelKey: 'dialog.Cancel', onClick: onClose, type: 'tertiary' }),
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('dialog.accessibilityLabel.Ok'), id: 'modal-dialog-ok-button', labelKey: 'dialog.Ok', onClick: onSubmit }))))));
};
exports.default = DialogWithTabs;
