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
const react_native_1 = require("react-native");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const Tokens_1 = require("../../../base/ui/Tokens");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const IconButton_1 = __importDefault(require("../../../base/ui/components/native/IconButton"));
const constants_native_1 = require("../../../base/ui/constants.native");
const functions_1 = require("../../../chat/functions");
const constants_1 = require("../../constants");
const NotificationsTransition_1 = require("../NotificationsTransition");
const styles_1 = __importDefault(require("./styles"));
/**
 * Secondary colors for notification icons.
 *
 * @type {{error, info, normal, success, warning}}
 */
const ICON_COLOR = {
    error: Tokens_1.colors.error06,
    normal: Tokens_1.colors.primary06,
    success: Tokens_1.colors.success05,
    warning: Tokens_1.colors.warning05
};
const Notification = ({ appearance = constants_1.NOTIFICATION_TYPE.NORMAL, customActionHandler, customActionNameKey, customActionType, description, descriptionArguments, descriptionKey, icon, onDismissed, title, titleArguments, titleKey, uid }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const notificationOpacityAnimation = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const { unmounting } = (0, react_1.useContext)(NotificationsTransition_1.NotificationsTransitionContext);
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.timing(notificationOpacityAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
        })
            .start();
    }, []);
    (0, react_1.useEffect)(() => {
        if (unmounting.get(uid ?? '')) {
            react_native_1.Animated.timing(notificationOpacityAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            })
                .start();
        }
    }, [unmounting]);
    const onDismiss = (0, react_1.useCallback)(() => {
        onDismissed(uid);
    }, [onDismissed, uid]);
    const mapAppearanceToButtons = () => {
        if (customActionNameKey?.length && customActionHandler?.length && customActionType?.length) {
            return customActionNameKey?.map((customAction, index) => (<Button_1.default accessibilityLabel={customAction} key={index} labelKey={customAction} mode={constants_native_1.BUTTON_MODES.TEXT} 
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
                    if (customActionHandler[index]()) {
                        onDismiss();
                    }
                }} style={styles_1.default.btn} 
            // @ts-ignore
            type={customActionType[index]}/>));
        }
        return [];
    };
    const getIcon = () => {
        let src;
        switch (icon || appearance) {
            case constants_1.NOTIFICATION_ICON.PARTICIPANT:
                src = svg_1.IconInfoCircle;
                break;
            case constants_1.NOTIFICATION_ICON.PARTICIPANTS:
                src = svg_1.IconUsers;
                break;
            case constants_1.NOTIFICATION_ICON.WARNING:
                src = svg_1.IconWarning;
                break;
            default:
                src = svg_1.IconInfoCircle;
                break;
        }
        return src;
    };
    const _getDescription = () => {
        const descriptionArray = [];
        descriptionKey
            && descriptionArray.push(t(descriptionKey, descriptionArguments));
        description && descriptionArray.push(description);
        return descriptionArray;
    };
    // eslint-disable-next-line react/no-multi-comp
    const _renderContent = () => {
        const titleText = title || (titleKey && t(titleKey, titleArguments));
        const descriptionArray = _getDescription();
        if (descriptionArray?.length) {
            return (<>
                    <react_native_1.Text style={styles_1.default.contentTextTitle}>
                        {titleText}
                    </react_native_1.Text>
                    {descriptionArray.map((line, index) => (<react_native_1.Text key={index} style={styles_1.default.contentText}>
                                {(0, functions_1.replaceNonUnicodeEmojis)(line)}
                            </react_native_1.Text>))}
                </>);
        }
        return (<react_native_1.Text style={styles_1.default.contentTextTitle}>
                {titleText}
            </react_native_1.Text>);
    };
    return (<react_native_1.Animated.View pointerEvents='box-none' style={[
            _getDescription()?.length
                ? styles_1.default.notificationWithDescription
                : styles_1.default.notification,
            {
                opacity: notificationOpacityAnimation
            }
        ]}>
            <react_native_1.View style={(icon === constants_1.NOTIFICATION_ICON.PARTICIPANTS
            ? styles_1.default.contentColumn
            : styles_1.default.interactiveContentColumn)}>
                <react_native_1.View style={styles_1.default.iconContainer}>
                    <Icon_1.default color={ICON_COLOR[appearance]} size={24} src={getIcon()}/>
                </react_native_1.View>
                <react_native_1.View pointerEvents='box-none' style={styles_1.default.contentContainer}>
                    {_renderContent()}
                </react_native_1.View>
                <react_native_1.View style={styles_1.default.btnContainer}>
                    {mapAppearanceToButtons()}
                </react_native_1.View>
            </react_native_1.View>
            <IconButton_1.default color={BaseTheme_native_1.default.palette.icon04} onPress={onDismiss} src={svg_1.IconCloseLarge} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
        </react_native_1.Animated.View>);
};
exports.default = Notification;
