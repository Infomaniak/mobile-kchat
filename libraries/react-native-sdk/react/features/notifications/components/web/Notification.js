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
const tss_react_1 = require("tss-react");
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const Message_1 = __importDefault(require("../../../base/react/components/web/Message"));
const functions_web_1 = require("../../../base/styles/functions.web");
const constants_1 = require("../../constants");
const NotificationsTransition_1 = require("../NotificationsTransition");
/**
 * Secondary colors for notification icons.
 *
 * @type {{error, info, normal, success, warning}}
 */
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        container: {
            backgroundColor: theme.palette.ui10,
            padding: '8px 16px 8px 20px',
            display: 'flex',
            position: 'relative',
            borderRadius: `${theme.shape.borderRadius}px`,
            boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.25)',
            marginBottom: theme.spacing(2),
            '&:last-of-type': {
                marginBottom: 0
            },
            animation: `${(0, tss_react_1.keyframes) `
                0% {
                    opacity: 0;
                    transform: translateX(-80%);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            `} 0.2s forwards ease`,
            '&.unmount': {
                animation: `${(0, tss_react_1.keyframes) `
                    0% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(-80%);
                    }
                `} 0.2s forwards ease`
            }
        },
        ribbon: {
            width: '4px',
            height: 'calc(100% - 16px)',
            position: 'absolute',
            left: 0,
            top: '8px',
            borderRadius: '4px',
            '&.normal': {
                backgroundColor: theme.palette.action01
            },
            '&.error': {
                backgroundColor: theme.palette.iconError
            },
            '&.success': {
                backgroundColor: theme.palette.success01
            },
            '&.warning': {
                backgroundColor: theme.palette.warning01
            }
        },
        content: {
            display: 'flex',
            alignItems: 'flex-start',
            padding: '8px 0',
            flex: 1,
            maxWidth: '100%'
        },
        textContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: theme.palette.text04,
            flex: 1,
            margin: '0 8px',
            // maxWidth: 100% minus the icon on left (20px) minus the close icon on the right (20px) minus the margins
            maxWidth: 'calc(100% - 40px - 16px)',
            maxHeight: '150px'
        },
        title: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold)
        },
        description: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            overflow: 'auto',
            overflowWrap: 'break-word',
            userSelect: 'all',
            '&:not(:empty)': {
                marginTop: theme.spacing(1)
            }
        },
        actionsContainer: {
            display: 'flex',
            width: '100%',
            '&:not(:empty)': {
                marginTop: theme.spacing(2)
            }
        },
        action: {
            border: 0,
            outline: 0,
            backgroundColor: 'transparent',
            color: theme.palette.action01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            marginRight: theme.spacing(3),
            padding: 0,
            cursor: 'pointer',
            '&:last-of-type': {
                marginRight: 0
            },
            '&.destructive': {
                color: theme.palette.textError
            }
        },
        closeIcon: {
            cursor: 'pointer'
        }
    };
});
const Notification = ({ appearance = constants_1.NOTIFICATION_TYPE.NORMAL, customActionHandler, customActionNameKey, customActionType, description, descriptionArguments, descriptionKey, hideErrorSupportLink, icon, onDismissed, title, titleArguments, titleKey, uid }) => {
    const { classes, cx, theme } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const { unmounting } = (0, react_1.useContext)(NotificationsTransition_1.NotificationsTransitionContext);
    const ICON_COLOR = {
        error: theme.palette.iconError,
        normal: theme.palette.action01,
        success: theme.palette.success01,
        warning: theme.palette.warning01
    };
    const onDismiss = (0, react_1.useCallback)(() => {
        onDismissed(uid);
    }, [uid]);
    // eslint-disable-next-line react/no-multi-comp
    const renderDescription = (0, react_1.useCallback)(() => {
        const descriptionArray = [];
        descriptionKey
            && descriptionArray.push(t(descriptionKey, descriptionArguments));
        description && typeof description === 'string' && descriptionArray.push(description);
        // Keeping in mind that:
        // - Notifications that use the `translateToHtml` function get an element-based description array with one entry
        // - Message notifications receive string-based description arrays that might need additional parsing
        // We look for ready-to-render elements, and if present, we roll with them
        // Otherwise, we use the Message component that accepts a string `text` prop
        const shouldRenderHtml = descriptionArray.length === 1 && (0, react_1.isValidElement)(descriptionArray[0]);
        // the id is used for testing the UI
        return (react_1.default.createElement("div", { className: classes.description, "data-testid": descriptionKey },
            shouldRenderHtml ? descriptionArray : react_1.default.createElement(Message_1.default, { text: descriptionArray.join(' ') }),
            typeof description === 'object' && description));
    }, [description, descriptionArguments, descriptionKey, classes]);
    const _onOpenSupportLink = () => {
        window.open(interfaceConfig.SUPPORT_URL, '_blank', 'noopener');
    };
    const mapAppearanceToButtons = (0, react_1.useCallback)(() => {
        switch (appearance) {
            case constants_1.NOTIFICATION_TYPE.ERROR: {
                const buttons = [
                    {
                        content: t('dialog.dismiss'),
                        onClick: onDismiss
                    }
                ];
                if (!hideErrorSupportLink && interfaceConfig.SUPPORT_URL) {
                    buttons.push({
                        content: t('dialog.contactSupport'),
                        onClick: _onOpenSupportLink
                    });
                }
                return buttons;
            }
            case constants_1.NOTIFICATION_TYPE.WARNING:
                return [
                    {
                        content: t('dialog.Ok'),
                        onClick: onDismiss
                    }
                ];
            default:
                if (customActionNameKey?.length && customActionHandler?.length) {
                    return customActionNameKey.map((customAction, customActionIndex) => {
                        return {
                            content: t(customAction),
                            onClick: () => {
                                if (customActionHandler?.[customActionIndex]()) {
                                    onDismiss();
                                }
                            },
                            type: customActionType?.[customActionIndex],
                            testId: customAction
                        };
                    });
                }
                return [];
        }
    }, [appearance, onDismiss, customActionHandler, customActionNameKey, hideErrorSupportLink]);
    const getIcon = (0, react_1.useCallback)(() => {
        let iconToDisplay;
        switch (icon || appearance) {
            case constants_1.NOTIFICATION_ICON.ERROR:
            case constants_1.NOTIFICATION_ICON.WARNING:
                iconToDisplay = svg_1.IconWarningCircle;
                break;
            case constants_1.NOTIFICATION_ICON.SUCCESS:
                iconToDisplay = svg_1.IconCheck;
                break;
            case constants_1.NOTIFICATION_ICON.MESSAGE:
                iconToDisplay = svg_1.IconMessage;
                break;
            case constants_1.NOTIFICATION_ICON.PARTICIPANT:
                iconToDisplay = svg_1.IconUser;
                break;
            case constants_1.NOTIFICATION_ICON.PARTICIPANTS:
                iconToDisplay = svg_1.IconUsers;
                break;
            default:
                iconToDisplay = svg_1.IconInfo;
                break;
        }
        return iconToDisplay;
    }, [icon, appearance]);
    return (react_1.default.createElement("div", { className: cx(classes.container, unmounting.get(uid ?? '') && 'unmount'), "data-testid": titleKey || descriptionKey, id: uid },
        react_1.default.createElement("div", { className: cx(classes.ribbon, appearance) }),
        react_1.default.createElement("div", { className: classes.content },
            react_1.default.createElement("div", { className: icon },
                react_1.default.createElement(Icon_1.default, { color: ICON_COLOR[appearance], size: 20, src: getIcon() })),
            react_1.default.createElement("div", { className: classes.textContainer },
                react_1.default.createElement("span", { className: classes.title }, title || t(titleKey ?? '', titleArguments)),
                renderDescription(),
                react_1.default.createElement("div", { className: classes.actionsContainer }, mapAppearanceToButtons().map(({ content, onClick, type, testId }) => (react_1.default.createElement("button", { className: cx(classes.action, type), "data-testid": testId, key: content, onClick: onClick }, content))))),
            react_1.default.createElement(Icon_1.default, { className: classes.closeIcon, color: theme.palette.icon04, id: 'close-notification', onClick: onDismiss, size: 20, src: svg_1.IconCloseLarge, testId: `${titleKey || descriptionKey}-dismiss` }))));
};
exports.default = Notification;
