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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../base/i18n/functions");
const actions_web_1 = require("../actions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        overlayContainer: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.ui02,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        laptop: {
            width: '88px',
            height: '56px',
            boxSizing: 'border-box',
            border: '3px solid',
            borderColor: theme.palette.text01,
            borderRadius: '6px'
        },
        laptopStand: {
            width: '40px',
            height: '4px',
            backgroundColor: theme.palette.text01,
            boxSizing: 'border-box',
            borderRadius: '6px',
            marginTop: '4px'
        },
        sharingMessage: {
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '28px',
            marginTop: '24px',
            letterSpacing: '-0.012em',
            color: theme.palette.text01
        },
        showSharing: {
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '20px',
            height: '20px',
            marginTop: '16px',
            color: theme.palette.link01,
            cursor: 'pointer',
            '&:hover': {
                color: theme.palette.link01Hover
            }
        }
    };
});
/**
 * Component that displays a placeholder for when the screen is shared.
 * * @param {Function} t - Function which translate strings.
 *
 * @returns {ReactElement}
 */
const ScreenSharePlaceholder = ({ t }) => {
    const { classes } = useStyles();
    const store = (0, react_redux_1.useStore)();
    const updateShowMeWhatImSharing = (0, react_1.useCallback)(() => {
        store.dispatch((0, actions_web_1.setSeeWhatIsBeingShared)(true));
    }, []);
    return (react_1.default.createElement("div", { className: classes.overlayContainer },
        react_1.default.createElement("div", { className: classes.content },
            react_1.default.createElement("div", { className: classes.laptop }),
            react_1.default.createElement("div", { className: classes.laptopStand }),
            react_1.default.createElement("span", { className: classes.sharingMessage }, t('largeVideo.screenIsShared')),
            react_1.default.createElement("span", { className: classes.showSharing, onClick: updateShowMeWhatImSharing, role: 'button' }, t('largeVideo.showMeWhatImSharing')))));
};
exports.default = (0, functions_1.translate)(ScreenSharePlaceholder);
