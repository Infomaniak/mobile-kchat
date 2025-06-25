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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_focus_on_1 = require("react-focus-on");
const react_i18next_1 = require("react-i18next");
const tss_react_1 = require("tss-react");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../styles/functions.web");
const functions_web_2 = require("../../functions.web");
const DialogTransition_1 = require("./DialogTransition");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            width: '100%',
            height: '100%',
            position: 'fixed',
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegular),
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            zIndex: 301,
            animation: `${(0, tss_react_1.keyframes) `
                0% {
                    opacity: 0.4;
                }
                100% {
                    opacity: 1;
                }
            `} 0.2s forwards ease-out`,
            '&.unmount': {
                animation: `${(0, tss_react_1.keyframes) `
                    0% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0.5;
                    }
                `} 0.15s forwards ease-in`
            }
        },
        backdrop: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            backgroundColor: theme.palette.ui02,
            opacity: 0.75
        },
        modal: {
            backgroundColor: theme.palette.ui01,
            border: `1px solid ${theme.palette.ui03}`,
            boxShadow: '0px 4px 25px 4px rgba(20, 20, 20, 0.6)',
            borderRadius: `${theme.shape.borderRadius}px`,
            display: 'flex',
            flexDirection: 'column',
            height: 'auto',
            minHeight: '200px',
            maxHeight: '80vh',
            marginTop: '64px',
            animation: `${(0, tss_react_1.keyframes) `
                0% {
                    margin-top: 85px
                }
                100% {
                    margin-top: 64px
                }
            `} 0.2s forwards ease-out`,
            '&.medium': {
                width: '400px'
            },
            '&.large': {
                width: '664px'
            },
            '&.unmount': {
                animation: `${(0, tss_react_1.keyframes) `
                    0% {
                        margin-top: 64px
                    }
                    100% {
                        margin-top: 40px
                    }
                `} 0.15s forwards ease-in`
            },
            '@media (max-width: 448px)': {
                width: '100% !important',
                maxHeight: 'initial',
                height: '100%',
                margin: 0,
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                animation: `${(0, tss_react_1.keyframes) `
                    0% {
                        margin-top: 15px
                    }
                    100% {
                        margin-top: 0
                    }
                `} 0.2s forwards ease-out`,
                '&.unmount': {
                    animation: `${(0, tss_react_1.keyframes) `
                        0% {
                            margin-top: 0
                        }
                        100% {
                            margin-top: 15px
                        }
                    `} 0.15s forwards ease-in`
                }
            }
        },
        focusLock: {
            zIndex: 1
        }
    };
});
const BaseDialog = ({ children, className, description, disableBackdropClose, disableEnter, disableEscape, onClose, size = 'medium', submit, testId, title, titleKey }) => {
    const { classes, cx } = useStyles();
    const { isUnmounting } = (0, react_1.useContext)(DialogTransition_1.DialogTransitionContext);
    const { t } = (0, react_i18next_1.useTranslation)();
    const onBackdropClick = (0, react_1.useCallback)(() => {
        !disableBackdropClose && onClose?.();
    }, [disableBackdropClose, onClose]);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key === 'Escape' && !disableEscape) {
            onClose?.();
        }
        if (e.key === 'Enter' && !disableEnter) {
            submit?.();
        }
    }, [disableEnter, onClose, submit]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
    return (react_1.default.createElement("div", { className: cx(classes.container, isUnmounting && 'unmount'), "data-testid": testId },
        react_1.default.createElement("div", { className: classes.backdrop }),
        react_1.default.createElement(react_focus_on_1.FocusOn, { className: classes.focusLock, onClickOutside: onBackdropClick, returnFocus: 
            // If we return the focus to an element outside the viewport the page will scroll to
            // this element which in our case is undesirable and the element is outside of the
            // viewport on purpose (to be hidden). For example if we return the focus to the toolbox
            // when it is hidden the whole page will move up in order to show the toolbox. This is
            // usually followed up with displaying the toolbox (because now it is on focus) but
            // because of the animation the whole scenario looks like jumping large video.
            functions_web_2.isElementInTheViewport },
            react_1.default.createElement("div", { "aria-description": description, "aria-label": title ?? t(titleKey ?? ''), "aria-modal": true, className: cx(classes.modal, isUnmounting && 'unmount', size, className), "data-autofocus": true, role: 'dialog', tabIndex: -1 }, children))));
};
exports.default = BaseDialog;
