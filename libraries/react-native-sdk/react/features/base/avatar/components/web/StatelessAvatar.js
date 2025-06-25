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
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_web_1 = require("../../../styles/functions.web");
const functions_1 = require("../../functions");
const styles_1 = require("../styles");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        avatar: {
            backgroundColor: '#AAA',
            borderRadius: '50%',
            fontWeight: '600',
            color: theme.palette?.text01 || '#fff',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography?.heading1 ?? {}),
            fontSize: 'inherit',
            objectFit: 'cover',
            textAlign: 'center',
            overflow: 'hidden',
            '&.avatar-small': {
                height: '28px !important',
                width: '28px !important'
            },
            '&.avatar-xsmall': {
                height: '16px !important',
                width: '16px !important'
            },
            '& .jitsi-icon': {
                transform: 'translateY(50%)'
            },
            '& .avatar-svg': {
                height: '100%',
                width: '100%'
            }
        },
        initialsContainer: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        badge: {
            position: 'relative',
            '&.avatar-badge:after': {
                borderRadius: '50%',
                content: '""',
                display: 'block',
                height: '35%',
                position: 'absolute',
                bottom: 0,
                width: '35%'
            },
            '&.avatar-badge-available:after': {
                backgroundColor: styles_1.PRESENCE_AVAILABLE_COLOR
            },
            '&.avatar-badge-away:after': {
                backgroundColor: styles_1.PRESENCE_AWAY_COLOR
            },
            '&.avatar-badge-busy:after': {
                backgroundColor: styles_1.PRESENCE_BUSY_COLOR
            },
            '&.avatar-badge-idle:after': {
                backgroundColor: styles_1.PRESENCE_IDLE_COLOR
            }
        }
    };
});
const StatelessAvatar = ({ className, color, iconUser, id, initials, onAvatarLoadError, onAvatarLoadErrorParams, size, status, testId, url, useCORS }) => {
    const { classes, cx } = useStyles();
    const _getAvatarStyle = (backgroundColor) => {
        return {
            background: backgroundColor || undefined,
            fontSize: size ? size * 0.4 : '180%',
            height: size || '100%',
            width: size || '100%'
        };
    };
    const _getAvatarClassName = (additional) => cx('avatar', additional, className, classes.avatar);
    const _getBadgeClassName = () => {
        if (status) {
            return cx('avatar-badge', `avatar-badge-${status}`, classes.badge);
        }
        return '';
    };
    const _onAvatarLoadError = (0, react_1.useCallback)(() => {
        if (typeof onAvatarLoadError === 'function') {
            onAvatarLoadError(onAvatarLoadErrorParams);
        }
    }, [onAvatarLoadError, onAvatarLoadErrorParams]);
    if ((0, functions_1.isIcon)(url)) {
        return (react_1.default.createElement("div", { className: cx(_getAvatarClassName(), _getBadgeClassName()), "data-testid": testId, id: id, style: _getAvatarStyle(color) },
            react_1.default.createElement(Icon_1.default, { size: '50%', src: url })));
    }
    if (url) {
        return (react_1.default.createElement("div", { className: _getBadgeClassName() },
            react_1.default.createElement("img", { alt: 'avatar', className: _getAvatarClassName(), crossOrigin: useCORS ? '' : undefined, "data-testid": testId, id: id, onError: _onAvatarLoadError, src: url, style: _getAvatarStyle() })));
    }
    if (initials) {
        return (react_1.default.createElement("div", { className: cx(_getAvatarClassName(), _getBadgeClassName()), "data-testid": testId, id: id, style: _getAvatarStyle(color) },
            react_1.default.createElement("div", { className: classes.initialsContainer }, initials)));
    }
    // default avatar
    return (react_1.default.createElement("div", { className: cx(_getAvatarClassName('defaultAvatar'), _getBadgeClassName()), "data-testid": testId, id: id, style: _getAvatarStyle() },
        react_1.default.createElement(Icon_1.default, { size: '50%', src: iconUser })));
};
exports.default = StatelessAvatar;
